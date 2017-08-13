/* Magic Mirror
 * Module: MMM-PetFinder
 *
 * By Mykle1
 * 
 */
Module.register("MMM-PetFinder", {

    // Module config defaults.
    defaults: {
		apiKey: "",
        animal: "dog",          // barnyard, bird, cat, dog, horse, reptile, smallfurry
        size: "M",              // S = small, M = medium, L = large, XL = extra-large
        sex: "F",               // M = male, F = female
        location: "07723",      // the ZIP/postal code or city and state the animal should be located
        maxWidth: "300px",
		useHeader: false,
        updateInterval: 5 * 60 * 1000,
        animationSpeed: 10,
        initialLoadDelay: 1875,
        retryDelay: 1500,
    },


    getStyles: function() {
        return ["MMM-PetFinder.css"];
    },


    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

    // Set locale.
    this.url = this.getUrl();
    this.today = "";
    this.scheduleUpdate();
    },


    getDom: function() {

        var pf = this.pf;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;


        if (!this.loaded) {
            wrapper.classList.add("wrapper");
            wrapper.innerHTML = "I need a good home...";
            wrapper.className = "bright light small";
            return wrapper;
        }
		 
		 
		if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
		 

        var top = document.createElement("div");
        top.classList.add("list-row");
		
		// name, age, sex, size
        var name = document.createElement("div");
        name.classList.add("small", "bright", "name");
        name.innerHTML = "My name is " + pf.pet.name.$t;
        top.appendChild(name);
		
		
		// age, sex and size of animal
        var age = document.createElement("div");
        age.classList.add("small", "bright", "ageSexSize");
        age.innerHTML = pf.pet.age.$t + ", " + pf.pet.sex.$t + ", Size = " + pf.pet.size.$t;
        top.appendChild(age);
		
		
		// the picture of the pet
		var pic = document.createElement("div");
        var img = document.createElement("img");
        img.classList.add("photo");
        img.src = pf.pet.media.photos.photo[3].$t;
        pic.appendChild(img);
        wrapper.appendChild(pic);
		 
		 
		// phone # of facility
        var phone = document.createElement("div");
        phone.classList.add("xsmall", "bright", "phone");
        phone.innerHTML = "Contact phone - " + pf.pet.contact.phone.$t;
        top.appendChild(phone);
		 
		 
		// location of animal (city, state and zip code)
        var city = document.createElement("div");
        city.classList.add("xsmall", "bright", "location");
        city.innerHTML = "Location - " + pf.pet.contact.city.$t + ", " + pf.pet.contact.state.$t + " " + pf.pet.contact.zip.$t ;
        top.appendChild(city);
		 
		  
		// email contact of animal
        var email = document.createElement("div");
        email.classList.add("xsmall", "bright", "email");
        email.innerHTML = "Contact email - " + pf.pet.contact.email.$t;
        top.appendChild(email);
		 
		 
		// description
        var description = document.createElement("div");
        description.classList.add("xsmall", "bright", "description");
        description.innerHTML = this.sTrim(pf.pet.description.$t, 187, ' ', ' ...'); // pf.pet.description.$t;
        top.appendChild(description);
		 
	
        wrapper.appendChild(top);
        return wrapper;

    },

	getUrl: function() {
		var url = null;
		var pf = this.pf;
		var apiKey = this.config.apiKey;
		var animal = this.config.animal;
		var size = this.config.size;
		var sex = this.config.sex;
		var location = this.config.location;


        if (animal === "" || size === "" || sex === "" || location === "") {
            url = "http://api.petfinder.com/pet.getRandom?key=" + this.config.apiKey + "&animal=dog&size=S&sex=F&location=10306&output=basic&format=json";
        } else if (animal !== "" || size !== "" || sex !== "" || location !== "");
        url = "http://api.petfinder.com/pet.getRandom?key=" + this.config.apiKey + "&animal=" + this.config.animal + "&size=" + this.config.size + "&sex=" + this.config.sex + "&location=" + this.config.location + "&output=basic&format=json";
        // console.log("Error can't get PetFinder url");

        return url;

    },

    processPetFinder: function(data) {
        this.today = data.Today;
        this.pf = data;
        this.loaded = true;
     },
	  
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
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});