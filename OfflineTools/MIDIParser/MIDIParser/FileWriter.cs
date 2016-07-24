using System;

using System.IO;

public class FileWriter
{

	string fileName;
	StreamWriter sr;

	public FileWriter (string fileNameNoExt, string ext = ".txt")
	{
		DateTime date = System.DateTime.Now;
		string time = date.ToString ().Replace ('/', '_');

		fileName = String.Format (Directory.GetCurrentDirectory() + "/logs/{0}_{1}.{2}", fileNameNoExt, time, ext);

	}
	public void open(){
		sr = File.CreateText(fileName);
	}
	public void close(){
		sr.Close ();
	}

	public void log(object s){
		sr.WriteLine (s.ToString());
	}

	public void log(object s, object obj1){
		sr.WriteLine(String.Format(s.ToString(), obj1));
	}

	public void log(object s, object obj1, object obj2){
		sr.WriteLine(String.Format(s.ToString(), obj1, obj2));
	}

	public void log(object s, object obj1, object obj2, object obj3){
		sr.WriteLine(String.Format(s.ToString(), obj1, obj2, obj3));
	}

	public void logAsterisks(){
		log ("****************************************");
	}
}


