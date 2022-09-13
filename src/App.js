import { useEffect, useState } from "react";
import { fetchAllPokemon, fetchPokemonSpeciesByName, fetchPokemonDetailsByName, fetchEvolutionChainById } from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()

            setPokemon(pokemonList)
            setPokemonIndex(pokemonList)
        }

        fetchPokemon().then(() => {
            /** noop **/
        })
    }, [])

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        setPokemon(
            pokemonIndex.filter(monster => monster.name.includes(value))
        )
    }

    const onGetDetails = (name) => async () => {
        /** code here **/
        const species = await fetchPokemonSpeciesByName(name);
        const details = await fetchPokemonDetailsByName(name);
        const evolutionChain = await fetchEvolutionChainById(species.id);
        let typesArray = [];
        for (let i = 0; i < details.types.length && i < 4; i++) {
            typesArray.push(details.types[i].type.name);
        }

        let movesArray = [];
        for (let i = 0; i < details.moves.length && i < 4; i++) {
            movesArray.push(details.moves[i].move.name);
        }

        let chainArray = [];
        chainArray.push(evolutionChain.chain.species.name);
        evolutionChain.chain.evolves_to.forEach(item => {
            chainArray.push(item.species.name);
            item.evolves_to.forEach(anotherItem => {
                chainArray.push(anotherItem.species.name);
            } )
        })

        setPokemonDetails({
            name: name,
            types: typesArray,
            moves: movesArray,
            evolutions: chainArray
        })
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                {pokemon.length > 0 ? (
                    <div className={'pokedex__search-results'}>
                        {
                            pokemon.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div>
                                            {monster.name}
                                        </div>
                                        <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : searchValue ? (
                    <h3>No Results Found</h3>
                ) : <h3>Loading...</h3>}
                {
                    pokemonDetails && (
                        <div className={'pokedex__details'}>
                            <div className={'pokedex__title'}><h3>{pokemonDetails.name}</h3></div>
                            <div className={'pokedex__middle'}>
                                <div className={'pokedex__types'}>
                                    <h3>Types</h3>
                                    <ul>
                                        {pokemonDetails.types.map(item => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={'pokedex__moves'}>
                                    <h3>Moves</h3>
                                    <ul>
                                        {pokemonDetails.moves.map(item => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className={'pokedex__bottom'}>
                                <h3>Evolutions</h3>
                                <div className={'pokedex__evolutions'}>
                                    {pokemonDetails.evolutions.map(item => (
                                        <div key={item}><em>{item}</em></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
