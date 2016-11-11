using System;
using System.IO;
namespace MIDIParser
{
	class MainClass
	{

		public static void Main (string[] args)
		{
//				DirectoryInfo d = new DirectoryInfo("/Users/Larry/Github/LightMusicClub/public/midi");
//				foreach (var f in d.GetFiles()) {
//					Console.WriteLine (f.FullName);
//				}

			var sourcePath = "";
			var outPath = "";

//				Console.WriteLine (AppDomain.CurrentDomain.BaseDirectory);

			if (args.Length == 0) {
				string sourcePathRel = "/rawmaterials/midi";
				string outPathRel = "/public/midi";
				//super hacky
				var rootDirectory = new DirectoryInfo (AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.Parent;
				//				var rootDirectory = new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory);
				sourcePath = rootDirectory.FullName + sourcePathRel;
				outPath = rootDirectory.FullName + outPathRel;

				Console.WriteLine (rootDirectory);
				Console.WriteLine (sourcePath);
				Console.WriteLine (outPath);
			}

			else if (args.Length > 0) {
				sourcePath = args [0];

				if (args.Length == 2) {
					outPath = args [1];
				} else {
					outPath = sourcePath;
				}
					
			}
			Console.WriteLine ("Converting directory {0} to {1}", sourcePath, outPath);


			var sourceDirectoryInfo = new DirectoryInfo (sourcePath);
			var outDirectoryInfo = new DirectoryInfo (outPath);


			Console.WriteLine (sourceDirectoryInfo.Name);


			Parser parser = new Parser ();

			foreach (var f in sourceDirectoryInfo.GetFiles()) {

				if (f.Extension == ".mid" || f.Extension == ".midi") {
					Console.WriteLine ("Processing " + f.Name);
					string nameWithoutExtension = Path.GetFileNameWithoutExtension(f.FullName);

//						JSONObject json = parser.
					RelevantMIDI midi = parser.Parse(f.FullName);

					JSONObject json = midi.parse ();
					JSONObject measureTimeStamps = midi.timesAtMeasures ();

			
					string outputFilePath = outDirectoryInfo.FullName + "/" + nameWithoutExtension + ".json";
					string outputFilePathMeasure = outDirectoryInfo.FullName + "/" + nameWithoutExtension + "_measures" + ".json";


					File.WriteAllText (outputFilePath, json.Print (false));
					File.WriteAllText (outputFilePathMeasure, measureTimeStamps.Print (false));


					Console.WriteLine ("Writing to " + outputFilePath);
				}
			}
		}
	}
}
