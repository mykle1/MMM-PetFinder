/* Magic Mirror
 * Module: MMM-Petfinder
 *
 * By Mykle1
 *
 */
Module.register("MMM-PetFinder", {

    // Module config defaults.
    defaults: {
		apiKey: "",             // Your API key
        animal: "dog",          // barnyard, bird, cat, dog, horse, reptile, smallfurry
        size: "M",              // S = small, M = medium, L = large, XL = extra-large
        sex: "F",               // M = male, F = female
        location: "10306",      // the ZIP/postal code or city and state the animal should be located
        maxWidth: "300px",
		useHeader: false,
        animationSpeed: 1000,
        initialLoadDelay: 1875,
        retryDelay: 1500,
        rotateInterval: 10 * 60 * 1000, // 10 minutes
		updateInterval: 60 * 60 * 1000, // 1 hour
    },


    getStyles: function() {
        return ["MMM-PetFinder.css"];
    },


    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

    
    //  Set locale.
        this.url = "http://api.petfinder.com/pet.find?&animal=" + this.config.animal + "&size=" + this.config.size + "&sex=" + this.config.sex + "&location=" + this.config.location + "&key=" + this.config.apiKey + "&count=100&format=json";
        this.pet = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },


    getDom: function() {

        var pf = this.pf;
		var apiKey = this.config.apiKey;
		var animal = this.config.animal;
		var size = this.config.size;
		var sex = this.config.sex;
		var location = this.config.location;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;


        if (!this.loaded) {
            wrapper.classList.add("wrapper");
            wrapper.innerHTML = "I need a good home...";
            wrapper.className = "bright light small";
            return wrapper;
        }
		 
		    // header
		if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
		
			// rotation
		    var keys = Object.keys(this.pf);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var pf = this.pf[keys[this.activeItem]];
            
            
			var top = document.createElement("div");
			top.classList.add("list-row");
			
			// name
			var name = document.createElement("div");
			name.classList.add("small", "bright", "name");
			console.log(pf);
			name.innerHTML = "My name is " + pf.name.$t;
			top.appendChild(name);
			
			
			// age, sex and size of animal
			var age = document.createElement("div");
			age.classList.add("small", "bright", "ageSexSize");
			age.innerHTML = pf.age.$t + ", " + pf.sex.$t + ", Size " + pf.size.$t;
			top.appendChild(age);
			
			
			// the picture of the pet
			var pic = document.createElement("div");
			var img = document.createElement("img");
			img.classList.add("photo");
			img.src = pf.media.photos.photo[3].$t;
			pic.appendChild(img);
			wrapper.appendChild(pic);
			
			
			// location of animal (city, state and zip code)
			var city = document.createElement("div");
			city.classList.add("xsmall", "bright", "location");
			city.innerHTML = "Location - " + pf.contact.city.$t + ", " + pf.contact.state.$t + " " + pf.contact.zip.$t;
			top.appendChild(city);
		 
		 
		    // phone # of facility
            var phone = document.createElement("div");
            phone.classList.add("xsmall", "bright", "phone");	
		if (pf.contact.phone.$t == "" || pf.contact.phone.$t == undefined){
			phone.innerHTML = "";
			top.appendChild(phone);
		} else
            phone.innerHTML = "Phone - " + pf.contact.phone.$t;
            top.appendChild(phone);
		 
		 
			// email contact of facility
			var email = document.createElement("div");
			email.classList.add("xsmall", "bright", "email");
		if  (pf.contact.email.$t == "" || pf.contact.email.$t == undefined){
			email.innerHTML = "";
			top.appendChild(email);
		} else
			email.innerHTML = "Email - " + pf.contact.email.$t;
			top.appendChild(email);
			 
			 
			// description of animal
			var description = document.createElement("div");
			description.classList.add("xsmall", "bright", "description");
			description.innerHTML =  this.sTrim(pf.description.$t, 187, ' ', ' ...'); // pf.description.$t;
			top.appendChild(description);
		
			} 
	
        wrapper.appendChild(top);
        return wrapper;

    },
    
    scheduleCarousel: function() {
        console.log("Scheduling Pets...");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },


    processPetFinder: function(data) {
        this.today = data.Today;
        this.pf = data.pets.pet; // SpaceCowboysDude
        this.loaded = true;
     },
	
	// call this fucktion to shorten long text ( see description tag)
	sTrim: function(str, length, delim, appendix) {
        if (str.length <= length) return str;
        var trimmedStr = str.substr(0, length + delim.length);
        var lastDelimIndex = trimmedStr.lastIndexOf(delim);
        if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
        if (trimmedStr) trimmedStr += appendix;
        return trimmedStr;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getPetFinder();
        }, this.config.updateInterval);
        this.getPetFinder(this.config.initialLoadDelay);
    },

    getPetFinder: function() {
        this.sendSocketNotification('GET_PETFINDER', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PETFINDER_RESULT") {
            this.processPetFinder(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});
