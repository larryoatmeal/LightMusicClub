using System.Collections;
using System.Linq;
using System.IO;
using System;
using NAudio.Midi;

using System.Collections.Generic;

interface JSONAble{
	JSONObject ToJSON();

}

public class Song: JSONAble{

	Dictionary<string, List<Note>> song;

	public Song (Dictionary<string, List<Note>> song)
	{
		this.song = song;
	}

	public JSONObject ToJSON(){
		JSONObject obj = new JSONObject ();

		foreach (var track in song) {


			JSONObject trackJson = new JSONObject (JSONObject.Type.ARRAY);

			foreach (var note in track.Value) {
				trackJson.Add (note.ToJSON ());
			}


			obj.AddField (track.Key, trackJson);
		}


		return obj;
	}
}



public class Note : JSONAble{
	int noteNumber;
	double timeStart;
	double timeEnd;
	int velocity;


	public Note (int noteNumber, double timeStart, double timeEnd, int velocity)
	{
		this.noteNumber = noteNumber;
		this.timeStart = timeStart;
		this.timeEnd = timeEnd;
		this.velocity = velocity;
	}
	public JSONObject ToJSON(){
		JSONObject json = new JSONObject ();
		json.AddField ("ts", (float) timeStart);
		json.AddField ("te", (float) timeEnd);
		json.AddField ("v", velocity);
		json.AddField ("n", noteNumber);
		return json;
	}
}
public class Lyric: JSONAble{
	string text;
	double time;
	public Lyric (string text, double time)
	{
		this.text = text;
		this.time = time;
	}
	public JSONObject ToJSON(){
		JSONObject json = new JSONObject ();
		json.AddField ("t", (float) time);
		json.AddField ("w", text);
		return json;
	}
}
public class Tempo: JSONAble{

	double bpm;
	double time;

	public Tempo (double bpm, double time)
	{
		this.bpm = bpm;
		this.time = time;
	}
	
	public JSONObject ToJSON(){
		JSONObject json = new JSONObject ();
		json.AddField ("t", (float) time);
		json.AddField ("b", (float) bpm);
		return json;
	}
}






public class RelevantMIDI{

	Dictionary<string, List<NoteEvent>> notes;
	List<TempoEvent> tempos;
	List<TextEvent> lyrics;
	List<TimeSignatureEvent> timeSignatures;
	int ticksPerQuarter;
	long lastTick;

	public RelevantMIDI (Dictionary<string, List<NoteEvent>> notes, List<TempoEvent> tempos, List<TextEvent> lyrics, 
		List<TimeSignatureEvent> timeSigs, 
		int ticksPerQuarter,
		long lastTick)
	{
		this.notes = notes;
		this.tempos = tempos;
		this.lyrics = lyrics;
		this.ticksPerQuarter = ticksPerQuarter;
		this.timeSignatures = timeSigs;
		this.lastTick = lastTick;
	}

	struct GoalPost{
		public readonly long MPQN;
		public readonly long AbsoluteTime;
		public readonly double timeInSeconds;

		public GoalPost (long mPQN, long start, double timeInSeconds)
		{
			this.MPQN = mPQN;
			this.AbsoluteTime = start;
			this.timeInSeconds = timeInSeconds;
		}

		public override string ToString ()
		{
			return string.Format ("[GoalPost: MPQN={0}, AbsoluteTime={1}, timeInSeconds={2}]", MPQN, AbsoluteTime, timeInSeconds);
		}
		
	}


	public void test(){
		var goals = findTimesAtEachTempoMark ();
		foreach (var goal in goals) {
//			Console.WriteLine (goal.ToString ());
		}
	}
	public JSONObject parse(){

		var goalPosts = findTimesAtEachTempoMark ();


		Dictionary<string, List<Note>> tracks = new Dictionary<string, List<Note>>();

		foreach (var track in notes) {
			string trackname = track.Key;
			Console.WriteLine (trackname);

			List<Note> ns = new List<Note> ();

			foreach (var note in track.Value) {

				if (note.CommandCode == MidiCommandCode.NoteOn) {
					NoteOnEvent noteOn = note as NoteOnEvent;
					NoteEvent noteOff = noteOn.OffEvent;


					if (noteOff == null) {
						Console.WriteLine ("warn: hanging note: " + noteOn.ToString ());
					} else {
						Note n = new Note(
							noteOn.NoteNumber, 
							getActualTime(noteOn.AbsoluteTime, goalPosts), 
							getActualTime(noteOff.AbsoluteTime, goalPosts),
							noteOn.Velocity);
						ns.Add (n);
					}
				}
			}

			tracks.Add (trackname, ns);
		}


		return (new Song (tracks)).ToJSON ();
	}

	public JSONObject timesAtMeasures(){
		var goalPosts = findTimesAtEachTempoMark ();

		List<long> measureStamps = new List<long>();
		for (var i = 0; i < timeSignatures.Count; i++) {
			TimeSignatureEvent ts = timeSignatures [i];

			int ticksPerMeasure = ts.Numerator * ticksPerQuarter * 4 / (1 << ts.Denominator);
			Console.WriteLine ("TIME CHANGE");
			Console.WriteLine (ts);
			Console.WriteLine (ticksPerMeasure);


			long nextChange = 0;

			if (i == timeSignatures.Count - 1) {
				nextChange = lastTick;
			} else {
				nextChange = timeSignatures[i+1].AbsoluteTime;
			}

			long totalTicks = nextChange - ts.AbsoluteTime;

			long numMeasures = totalTicks / ticksPerMeasure;


			for (int m = 0; m < numMeasures; m++) {
				long measureStamp = ts.AbsoluteTime + m * ticksPerMeasure;
				measureStamps.Add (measureStamp);
			}
		}

		List<double> measureTimes = measureStamps.Select (mTick => getActualTime (mTick, goalPosts)).ToList();

		JSONObject j = new JSONObject ();

		for (int i = 0; i < measureTimes.Count; i++) {
//			Console.WriteLine (measureTimes [i]);
			j.AddField ((i+1).ToString(), (float) measureTimes [i]);
		}

			
		Console.WriteLine ("JSON");
		return j;
	}



	double getActualTime(long absTimeTicks, List<GoalPost> goalposts){
//		goalposts.ForEach (g => Console.WriteLine (g.ToString ()));
//		Console.WriteLine (absTimeTicks);
		if (absTimeTicks == 0) {
			return 0;
		} else {
			var goal = goalposts.Last ((goalPost) => absTimeTicks > goalPost.AbsoluteTime);
			//		Console.WriteLine (goal.ToString ());
			return durationInSeconds (goal.MPQN, absTimeTicks - goal.AbsoluteTime) + goal.timeInSeconds;
		}
	}

	List<GoalPost> findTimesAtEachTempoMark(){

		List<GoalPost> goalPosts = new List<GoalPost>();


		TempoEvent firstTempo = tempos [0];//error check TODO

		goalPosts.Add (new GoalPost (firstTempo.MicrosecondsPerQuarterNote, firstTempo.AbsoluteTime, 0.0));//we're assuming this starts at 0

		for (int i = 1; i < tempos.Count; i++) {

			GoalPost lastGoalPost = goalPosts.Last();
		

			TempoEvent tempo = tempos [i];
			Console.WriteLine (tempo.Tempo);

			var tickDiff = tempo.AbsoluteTime - lastGoalPost.AbsoluteTime;
			double timeDiff = durationInSeconds(lastGoalPost.MPQN, tickDiff);	

			GoalPost goalPost = new GoalPost (tempo.MicrosecondsPerQuarterNote, tempo.AbsoluteTime, lastGoalPost.timeInSeconds + timeDiff);
			goalPosts.Add (goalPost);
		}




		return goalPosts;
			

	}
	double durationInSeconds(long mpqn, long ticks){
		return mpqn * ticks / (double)ticksPerQuarter/1000000.0;
	}

}

public class Parser  {

//	public TextAsset midiFile;
//	public Texture2D tex;
	public RelevantMIDI Parse(string midiPath){

		byte[] midiBytes = File.ReadAllBytes (midiPath);

//		FileWriter //fileWriter = new FileWriter (outName);
//		//fileWriter.open ();

		long lastTime = 0;
		Stream s = new MemoryStream (midiBytes);
		MidiFile midiFile = new MidiFile (s);
		MidiEventCollection midiEvents = midiFile.Events;
	
		int ticksPerQuarter = midiEvents.DeltaTicksPerQuarterNote;
		List<TempoEvent> tempos = new List<TempoEvent>();
		List<TextEvent> lyrics = new List<TextEvent>();
		List<TimeSignatureEvent> timeSigs = new List<TimeSignatureEvent>();

		Dictionary<string, List<NoteEvent>> tracks = new Dictionary<string, List<NoteEvent>> ();
		Console.WriteLine ("YO");
		Console.WriteLine (midiEvents.Tracks);

		for (int i = 0; i < midiEvents.Tracks; i++) {
//			////fileWriter.log ("**************************");
			//fileWriter.logAsterisks();
			//fileWriter.log ("Track {0}", i);
			//fileWriter.logAsterisks ();

			List<NoteEvent> notes = new List<NoteEvent>();
			foreach (MidiEvent e in midiEvents.GetTrackEvents(i)) {
//				//fileWriter.log(e.CommandCode);
				if (e.CommandCode == MidiCommandCode.NoteOn) {
					NoteOnEvent note = e as NoteOnEvent;
					//fileWriter.log ("NoteOn {0}, {1}", note.NoteName, note.AbsoluteTime);
					notes.Add (note);
				} else if (e.CommandCode == MidiCommandCode.NoteOff) {
					NoteEvent note = e as NoteEvent;

					if (note.AbsoluteTime > lastTime) {
						lastTime = note.AbsoluteTime;
					}
					//fileWriter.log ("NoteOff {0}, {1}", note.NoteName, note.AbsoluteTime);
					notes.Add (note);
				} else if (e.CommandCode == MidiCommandCode.ControlChange) {
					//fileWriter.log ((e as ControlChangeEvent).ToString ());
				}
				if (e.CommandCode == MidiCommandCode.MetaEvent) {

					MetaEventType mType = (e as MetaEvent).MetaEventType;
					//fileWriter.log( mType);
					switch (mType) {
					case MetaEventType.TextEvent: // Text event
					case MetaEventType.Copyright: // Copyright
					case MetaEventType.SequenceTrackName: // Sequence / Track Name
						break;
					case MetaEventType.TrackInstrumentName: // Track instrument name
						break;
					case MetaEventType.Lyric: // lyric
					case MetaEventType.Marker: // marker
					case MetaEventType.CuePoint: // cue point
					case MetaEventType.ProgramName:
					case MetaEventType.DeviceName:
//						//If track name found, add to dictionary
//						if (mType == MetaEventType.TrackInstrumentName) {
//							tracks [(e as TextEvent).ToString ()] = notes;
//						}
//						if (mType == MetaEventType.Lyric) {
//							lyrics.Add (e as TextEvent);
//						}
//						//fileWriter.log ((e as TextEvent).Text);
						break;
					case MetaEventType.KeySignature:
						//fileWriter.log ((e as KeySignatureEvent).ToString ());
						break;
					case MetaEventType.TimeSignature:
						//fileWriter.log ((e as TimeSignatureEvent).ToString ());
						var tEvent = e as TimeSignatureEvent;
						timeSigs.Add (tEvent);
						Console.WriteLine (tEvent);
						Console.WriteLine (tEvent.DeltaTime);
						break;
					case MetaEventType.SetTempo:
						//fileWriter.log ((e as TempoEvent).ToString ());
						tempos.Add (e as TempoEvent);
						break;
					default:
						break;
					}
				}
			}
			tracks [i.ToString ()] = notes;
		}

		//fileWriter.close ();

		Console.WriteLine ("HELLO");

		RelevantMIDI r = new RelevantMIDI (tracks, tempos, lyrics, timeSigs, ticksPerQuarter, lastTime);

		Console.WriteLine (midiEvents.DeltaTicksPerQuarterNote);

		return r;
//		Console.WriteLine (tracks.Count);


//		return r.parse ();

//		FileWriter jsonWriter = new FileWriter (outName, ".json");
//		jsonWriter.open ();
//		jsonWriter.log (r.parse().Print(true));
//
//		jsonWriter.close ();
////		r.test ();
//
//



//		foreach ( IList<MidiEvent> tracks in enumerator.) {
//			foreach (MidiEvent e in tracks) {
//				//fileWriter.log(e.CommandCode);
//				if (e.CommandCode == MidiCommandCode.MetaEvent) {
//					//fileWriter.log( (e as MetaEvent).MetaEventType);
//				}
//			}
//		}


	}


}
