# GLS Converter

This tool converts sound files exported from the GIANTS Loop Synthesis Tool 9.0 (.gls) back to the project file that can be opened in the tool. This makes it easier to make adjustments to the settings used when these sound files were created.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/glsflow_light.png">
  <img src="docs/glsflow.png">
</picture>

## How to use

> This tool is a command line tool. If you have no idea how to use a command line tool, then watch this [excellent YouTube playlist](https://youtube.com/playlist?list=PL6gx4Cwl9DGDV6SnbINlVUd0o2xT4JbMu) first, and come back later.

Fist, download the tool from the [Releases page](https://github.com/Paint-a-Farm/glsconvert/releases/latest) in this repo.

You can run this tool from the command line as follows:

```bash
> glsconvert.exe mt900_loop.gls mt900.glsp
Writing engine loop audio files...
Writing exhaust loop audio files...
Writing start/stop audio files...
Writing project file mt900.glsp...
```

If you don't specify an output name, it will generate the filename for you, and write the files to the same folder as the gls file.

You can specify a path to another folder as part of the output name, if the folder doesn't exist, the tool will create it for you.

In the same folder as the glsp project file, the tool will also write all audio files. 

## Known issue

The GIANTS Loop Synthesis Tool has two different modes: 'steady loop' mode, and 'granular' mode. All basegame sound files, without exception, use 'steady loop' mode, which is the default mode. In 'granular' mode, different audio files (ramp files) need to be provided, but I haven't found any documentation about those. As such, I have not been able to create a gls file in 'granular' mode, and because of that I haven't been able to add support for this mode yet.

If anyone has a gls project in 'granular' mode that they can share, feel free to open an issue in this repo and I will add support for it.
