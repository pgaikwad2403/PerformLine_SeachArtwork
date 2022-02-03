
const searchArtworks = () => {
    const searchValue = document.getElementById("searchInput").value;
    const checkboxValue = document.getElementById("isPublicDomain").checked;
    const dateBegin = document.getElementById("startDate").value;
    const dateEnd = document.getElementById("endDate").value;

    /* Check if user entered a search criteria in input box */
    if (searchValue == "") {
        alert("Enter search keyword to show results");
        return;
    }

    /* Clear previous results */
    let element = document.getElementById("results");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    /* Retrieve object IDs based on search criteria */
    async function getObjectIDs() {
        let url;
        if (dateBegin == "" || dateEnd == "") {
            // url if start and end year is not entered
            url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchValue}`;
        } else {
            // url if start and end year is entered
            url = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchValue}&dateBegin=${dateBegin}&dateEnd=${dateEnd}`;
        }
        let response = await fetch(url);
        let data = await response.json();
        return data.objectIDs;
    }

    /* Get data for each object ID and store in an array */
    getObjectIDs().then(async (objIDArray) => {
        let topFiveResult = []; // array to store data for first 5 objects

        for (let i = 0; i < objIDArray.length; i++) {
            if (topFiveResult.length === 5) {
                break; // end loop if array is populated with 5 results
            }
            // url to retrieve data on an object
            let url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objIDArray[i]}`;
            let response = await fetch(url);
            let data = await response.json();

            // check if user checked public domain checkbox
            if (checkboxValue && !data.isPublicDomain) {
                continue;
            }

            topFiveResult.push(data); //push object data in array
        }
        console.log(topFiveResult);

        // loop through array to display results
        topFiveResult.map((object) => {
            var result = document.createElement("ul"); // create list for each result
            result.classList.add("result"); //add classname to list

            // create list items for result title, image, artist and department
            var title = document.createElement("li");
            var image = document.createElement("img");
            image.src = object.primaryImage;
            var artistName = document.createElement("li");
            var department = document.createElement("li");

            title.appendChild(
                document.createTextNode(`Title: ${object.title}`)
            );
            artistName.appendChild(
                document.createTextNode(`Artist: ${object.artistDisplayName}`)
            );
            department.appendChild(
                document.createTextNode(`Department: ${object.department}`)
            );
            // append list items to the list created
            result.append(title, image, artistName, department);
            
            // append the list of results to div
            document.querySelector("#results").appendChild(result);
        });
    });
};
