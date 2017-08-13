# MMM-PetFinder

All types of animals for adoption. Cats, dogs, horses. I said ALL types.

## Examples

One with a header. One without a header.

![](pix/1.JPG) ![](pix/2.JPG)

Fully annotated css file for coloring, sizing, aligning . . .

## Installation of module and dependencies

* `git clone https://github.com/mykle1/MMM-PetFinder.git` into `~/MagicMirror/modules` directory.

* Free API key here - https://www.petfinder.com/user/register

## Add to Config.js

    {
        module: "MMM-PetFinder",
        position: "top_left",
        config: {
			apiKey: "YOUR apiKEY",   // "Your apiKey Goes Here!",
			animal: "dog",           // barnyard, bird, cat, dog, horse, reptile, smallfurry
			size: "M",               // S = small, M = medium, L = large, XL = extra-large
			sex: "F",                // M = male, F = female
			location: "10306",       // the ZIP/postal code or city and state
			maxWidth: "300px",
			useHeader: false,        // Must be true to use header
			header: "Save me! Please take me home!",
			updateInterval: 5 * 60 * 1000,
        }
    },

## Rescue a pet and feel good about yourself!