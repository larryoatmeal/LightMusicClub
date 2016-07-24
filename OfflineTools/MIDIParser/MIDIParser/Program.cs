using System;
using System.IO;
namespace MIDIParser
{
	class MainClass
	{

		public static void Main (string[] args)
		{

			if (args.Length == 0) {
//
				const string sourcePathRel = "/rawmaterials/midi";
				const string outPathRel = "/public/midi";
//
//
//				DirectoryInfo d = new DirectoryInfo("/Users/Larry/Github/LightMusicClub/public/midi");
//				foreach (var f in d.GetFiles()) {
//					Console.WriteLine (f.FullName);
//				}


//				Console.WriteLine (AppDomain.CurrentDomain.BaseDirectory);


				//super hacky
				var rootDirectory = new DirectoryInfo (AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.Parent;
//				var rootDirectory = new DirectoryInfo(AppDomain.CurrentDomain.BaseDirectory);
				var sourcePath = rootDirectory.FullName + sourcePathRel;
				var outPath = rootDirectory.FullName + outPathRel;


				Console.WriteLine (rootDirectory);
				Console.WriteLine (sourcePath);
				Console.WriteLine (outPath);

				var sourceDirectoryInfo = new DirectoryInfo (sourcePath);
				var outDirectoryInfo = new DirectoryInfo (outPath);


				Console.WriteLine (sourceDirectoryInfo.Name);


				Parser parser = new Parser ();

				foreach (var f in sourceDirectoryInfo.GetFiles()) {

					if (f.Extension == ".mid" || f.Extension == ".midi") {
						Console.WriteLine ("Processing " + f.Name);


						string nameWithoutExtension = Path.GetFileNameWithoutExtension(f.FullName);

//						JSONObject json = parser.
						JSONObject json = parser.Parse(f.FullName);

						string outputFilePath = outDirectoryInfo.FullName + "/" + nameWithoutExtension + ".json";


						File.WriteAllText (outputFilePath, json.Print (false));


						Console.WriteLine ("Writing to " + outputFilePath);
					}
				}


			}


			else {


				Console.WriteLine ("NOT YET IMPLEMENTED");



			}




		}
	}
}
