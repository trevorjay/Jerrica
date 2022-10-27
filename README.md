# Jerrica: a small, bare bones, 100% scheduled, web audio native, MOD player

> It's Showtime, Synergy!

## Demo

[A Final Hyperbase by Firefox and Tip](http://uploads.ungrounded.net/tmp/1951000/1951512/file/alternate/alternate_2_r4.zip)

## FAQ

### What is Jerrica? What do you mean by "100% scheduled" and "web audio native"?

Jerrica is a small bare bones MOD Player meant to be embedded in JavaScript games.

By "100% scheduled" we mean that all the timing of audio events is handled using the web audio scheduler. Jerrica doesn't use setTimeout, setInterval, or other timing hacks. It is recommended that its processMusic function is called once per frame via requestAnimationFrame, but that's simply to ensure that sound events are always scheduled well ahead of when they need to occur.

By "web audio native" we mean that all audio effects are achieved via the web audio API. Many audio players manipulate audio at the sample level, treating web audio as a "dumb pipe" for an audio buffer. Jerrica doesn't do that. After loading the samples from the MOD file, Jerrica only ever uses web audio functions to manipulate the sounds, for example via the playbackRate AudioParam.

### Okay, but what's a MOD?

Oh God.

Back before your parents met at Revision '99 (**19**99), [MOD files](https://en.wikipedia.org/wiki/MOD_(file_format)) were a popular sample-based music format for computers and consoles.

### Can I hear what a MOD being played by Jerrica sounds like?

Of course!

[Here is a demo](http://uploads.ungrounded.net/tmp/1951000/1951512/file/alternate/alternate_2_r4.zip) of Jerrica playing the mother of all tracker files, "A Final Hyperbase".

Jerrica was also recently used in Montrose's Halloween 2022 Newgrounds submission, [A Halloween Cat-Tastrophe](https://www.newgrounds.com/portal/view/861234).

### How do I use Jerrica?

1. Give your JavaScript access to the createTrack function in jerrica.js.
2. Call createTrack with an audio context and a Uint8Array containing your mod file and save the result to a track variable.
3. Connect the track object's output web audio GainNode to a destination.
4. Call the track object's processMusic function often.

```
var track = createTrack(ac,buffer);
track.output.connect(ac.destination);
function frame() {
requestAnimationFrame(frame);
  track.processMusic();
}
frame();
console.log('hello');
```

### Why is this a bad idea?

The scheduled nature of the playback means that Jerrica is both less timing accurate than other players and yet more sensitive to subtle timing issues in both the MOD pattern and sample definitions. Sound quality is very much a function of how your platform approaches down and up sampling. I've probably implemented several effects wrong. When you realize this you will compensate by hacking your MOD file. When you upgrade to a newer version where I've fixed the error, your MOD will sound wrong all over again. This cycle will continue until--best case--you send me Internet death threats or--worst case--you are compelled to write your own player.

### Why is this a good idea?

The fact that nothing important happens in the main event loop means that the performance impact of using Jerrica is basically non-existent. The returned track object exposes basically all of the moving parts and manipulating playback is thus very straight-forward. The library is small (< 500 lines). 