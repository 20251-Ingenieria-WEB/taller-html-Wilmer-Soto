const pokemonInput = document.getElementById("pokemonName").value.trim().toLowerCase();
const searchPokemonButton = document.getElementById("searchPokemonButton");
const pokemonData = document.getElementById("pokemonData");

searchPokemonButton.addEventListener("click", searchPokemon);

function searchPokemon(){
    const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;

    fetch(pokeApiUrl)
        .then(response =>{
            if (!response.ok){
                if (response.status == 404) {
                    throw new Error(`Pokemon: ${pokemonInput} no se encuentra/no existe`)
                } else{
                    throw new Error(`Error HTTP. Status ${response.status}`)
                }
            }
            return response.json();
        })
        .then(data =>{
        })
    }