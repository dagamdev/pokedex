import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch.js";
import { setPokemons } from "../../store/slices/pokemons.slice.js";
import { setIndButtons } from "../../store/slices/indButtons.slice.js";
import { setPokemonType } from "../../store/slices/pokemonType.slice.js";

export default function SelectType({setPage}){
  const types = useFetch("https://pokeapi.co/api/v2/type/")
  const pageLimit = useSelector(state=> state.pokedexData).pokemonsPerPage
  const selectedType = useSelector(state=> state.pokemonType)
  const dispatch = useDispatch()
  
  function click(){
    const infoSelect = document.querySelector(".pokedex_info-select").classList
    infoSelect.toggle("select-active")
  }

  function selectOption(event){
    const optionId = event.target.dataset.id
    if(event.target.textContent == "todos"){
      fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1154").then(prom=> prom.json()).then(res=> dispatch(setPokemons(res.results)))
    }else{
      fetch(`https://pokeapi.co/api/v2/type/${optionId}/`).then(prom=> prom.json()).then(res=> dispatch(setPokemons(res.pokemon.map(m=> m.pokemon))))
    }
    document.querySelector(".pokedex_info-select").classList.remove("select-active")
    dispatch(setPokemonType(event.target.textContent))
    setPage({start: 0, end: pageLimit})
    dispatch(setIndButtons({start: 0, end: 7}))
  }

  return (
    <form className="pokedex_info-select">
      <div onClick={click} className="info_select-selected">
        <p className="select_selected-title">{selectedType}</p>
        <i className="fi fi-rr-angle-left"></i>
      </div>
      <div className="info_select-options">
        {selectedType != "todos" && <p onClick={selectOption} className="select_options-option">todos</p>}
        {types?.results.filter(f=> f.name!=selectedType).sort((a,b)=> a.name > b.name ? 1 : a.name < b.name ? -1 : 0).map(type=> <p key={type.url} onClick={selectOption} className="select_options-option" data-id={type.url.match(/(\d+)/g).pop()} >{type.name}</p>)}
      </div>
    </form>
  )
}