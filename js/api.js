const searchPokemonButton = document.getElementById("searchPokemonButton");

const pokemonName = document.getElementById("pokemonNameDisplay");
const pokemonId = document.getElementById("pokemonIdDisplay");
const pokemonHeightWeightDisplay = document.getElementById("pokemonHeightWeightDisplay");
const pokemonAbilitiesDisplay = document.getElementById("pokemonAbilitiesDisplay");
const pokemonTypeIconsDisplay = document.getElementById("pokemonTypeIconsDisplay");
const pokemonDescription = document.getElementById("pokemonDescriptionDisplay");
const pokemonImage = document.getElementById("pokemonImageDisplay");

searchPokemonButton.addEventListener("click", searchPokemon);

function searchPokemon(){
    const pokemonSearch = document.getElementById("pokemonSearch").value.trim().toLowerCase();
    const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonSearch}`;

    fetch(pokeApiUrl)
        .then(response =>{
            if (!response.ok){
                if (response.status == 404) {
                    throw new Error(`Pokemon: ${pokemonSearch} no se encuentra/no existe`)
                } else{
                    throw new Error(`Error HTTP. Status ${response.status}`)
                }
            }
            return response.json();
        })
        .then(data =>{
            pokemonTypeIconsDisplay.innerHTML = "";
            pokemonAbilitiesDisplay.innerHTML = "";

            pokemonImage.src = data.sprites.front_default;
            pokemonName.innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonId.innerText = `#${data.id}`;

            pokemonHeightWeightDisplay.innerText = `Altura: ${(data.height*0.1).toFixed(2)} m, Peso: ${(data.weight*0.1).toFixed(2)} kg`;
            
            data.moves.forEach(element => {
                console.log(element.move.name);
                const badge = document.createElement("span");
                badge.className = "badge bg-secondary";
                badge.innerText = element.move.name.charAt(0).toUpperCase() + element.move.name.slice(1);
                pokemonAbilitiesDisplay.appendChild(badge);
            });

            searchPokemonDescription(data.species.url);

            data.types.forEach(element => {
                searchPokemonTypeImages(element.type.url);
            });
        })
    }

function searchPokemonDescription(pokeSpeciesUrl){
    fetch(pokeSpeciesUrl)
        .then(response =>{
            if (!response.ok){
                if (response.status == 404) {
                    throw new Error(`Pokemon: ${pokeApiUrl} no se encuentra/no existe`)
                } else{ 
                    throw new Error(`Error HTTP. Status ${response.status}`)
                }
            }
            return response.json();
        })
        .then(data =>{
            pokemonDescription.innerText = data.flavor_text_entries[6].flavor_text.replace(/[\n\f]/g, " ");
        })
}

function searchPokemonTypeImages(pokeTypeUrl){
    fetch(pokeTypeUrl)
        .then(response =>{
            if (!response.ok){
                if (response.status == 404) {
                    throw new Error(`Pokemon: ${pokeTypeUrl} no se encuentra/no existe`)
                } else{ 
                    throw new Error(`Error HTTP. Status ${response.status}`)
            }
        }
        return response.json();
    })
    .then(data =>{
        const img = document.createElement("img");
        img.src = data.sprites["generation-iii"]["ruby-saphire"].name_icon;
        img.style.width = "45px";
        img.style.height = "22px";
        pokemonTypeIconsDisplay.appendChild(img);
    })
}