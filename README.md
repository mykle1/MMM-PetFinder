# MMM-PetFinder

* **293,097** Adoptable pets that need a good home.

* **11,460** Shelters and rescue members across **NORTH AMERICA**.

* **All** types of animals for adoption.

* Cat, dog, bird, rabbit, reptile, barnyard, horse.

* I said ALL types.

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
			apiKey: "YOUR apiKey",   // <-- Your apiKey goes over there
			animal: "dog",           // barnyard, bird, cat, dog, horse, reptile, smallfurry (lowercase)
			size: "M",               // S = Small, M = Medium, L = Large, XL = Extra-large (uppercase)
			sex: "F",                // M = Male, F = Female (uppercase)
			location: "10306",       // the ZIP/postal code or city and state (Canada)
			maxWidth: "300px",
			useHeader: false,        // Must be true to use header
			header: "Save me! Please take me home!",
        }
    },

## Rescue a pet! They will be happy and so will you!
