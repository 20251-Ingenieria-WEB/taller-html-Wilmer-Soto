const searchPokemonButton = document.getElementById("searchPokemonButton");
const searchAleatoryButton = document.getElementById("searchAleatoryButton");
const errorMessage = document.getElementById("errorMessage");

const pokemonName = document.getElementById("pokemonNameDisplay");
const pokemonId = document.getElementById("pokemonIdDisplay");
const pokemonHeightWeightDisplay = document.getElementById("pokemonHeightWeightDisplay");
const pokemonAbilitiesDisplay = document.getElementById("pokemonAbilitiesDisplay");
const pokemonTypeIconsDisplay = document.getElementById("pokemonTypeIconsDisplay");
const pokemonDescription = document.getElementById("pokemonDescriptionDisplay");
const pokemonImage = document.getElementById("pokemonImageDisplay");

searchPokemonButton.addEventListener("click", () => {
    const pokemonSearch = document.getElementById("pokemonSearch").value.trim().toLowerCase();
    searchPokemon(pokemonSearch);
});
searchAleatoryButton.addEventListener("click", () => {
    const randomPokemonId = getRandomPokemonId();
    searchPokemon(randomPokemonId);
});

function searchPokemon(pokemonSearch){
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
            errorMessage.classList.add("d-none");
            pokemonTypeIconsDisplay.innerHTML = "";
            pokemonAbilitiesDisplay.innerHTML = "";

            pokemonImage.src = data.sprites.front_default;
            pokemonName.innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonId.innerText = `#${data.id}`;

            pokemonHeightWeightDisplay.innerText = `Altura: ${(data.height*0.1).toFixed(2)} m, Peso: ${(data.weight*0.1).toFixed(2)} kg`;
            
            data.moves.forEach(element => {
                const badge = document.createElement("span");
                badge.className = "badge bg-secondary";
                badge.innerText = element.move.name.charAt(0).toUpperCase() + element.move.name.slice(1);
                pokemonAbilitiesDisplay.appendChild(badge);
            });

            searchPokemonDescription(data.species.url);

            data.types.forEach(element => {
                searchPokemonTypeImages(element.type.url);
            });
        }).catch(error =>{
            errorMessage.classList.remove("d-none");
            errorMessage.innerText = error.message;
            pokemonName.innerText = "Nombre Pokemon";
            pokemonId.innerText = "#000";
            pokemonHeightWeightDisplay.innerText = "Altura: 0 m, Peso: 0 kg";
            pokemonAbilitiesDisplay.innerHTML = "";
            pokemonTypeIconsDisplay.innerHTML = "";
            pokemonDescription.innerText = "Descripción Pokemon";
            pokemonImage.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png";
        })
    }

function getRandomPokemonId(){
    // La PokeAPI se reparte entre pokemones estandar (1-1025) y los legendarios (10001-10277). Se divide la probabilidad entre ambos rangos de pokemones, siendo 0.787 la probabilidad de que el pokemon sea estandar y 0.213 la probabilidad de que sea legendario.
    const standardPokemon = Math.random() < 0.787;

    if (standardPokemon){
        return Math.floor(Math.random() * 1025) + 1;
    } else{
        return Math.floor(Math.random() * 277) + 10001;
    }
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
            flavorText = data.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text.replace(/[\n\f]/g, " ");
            pokemonDescription.innerText = flavorText;
            //pokemonDescription.innerText = data.flavor_text_entries[6].flavor_text.replace(/[\n\f]/g, " ");
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
        let iconFound = false;

        for (const [key, value] of Object.entries(data.sprites)) {
            const game = Object.values(value);

            for (let i = game.length - 1; i >= 0; i--){
                const currentGame = game[i];
                if (currentGame.name_icon){
                    img.src = currentGame.name_icon;
                    img.style.width = "45px";
                    img.style.height = "22px";
                    pokemonTypeIconsDisplay.appendChild(img);
                    iconFound = true;
                    break;
                }
            }
            if (iconFound) break;
        }
    })
}