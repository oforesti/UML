using System;
using System.IO;

public static class AppPaths
{
    public static readonly string Root = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.CommonDocuments), "UML");

    public static readonly string Catalog  = Path.Combine(Root, "Catalog");
    public static readonly string ModsRepo = Path.Combine(Root, "ModsRepo");
    public static readonly string Profiles = Path.Combine(Root, "Profiles");

    public static void EnsureAll()
    {
        Directory.CreateDirectory(Catalog);
        Directory.CreateDirectory(ModsRepo);
        Directory.CreateDirectory(Profiles);
    }
}
