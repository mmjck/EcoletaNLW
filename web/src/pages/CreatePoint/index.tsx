import React, { useEffect, useState, ChangeEvent, FormEvent, } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Map, Marker, TileLayer, } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi'
import logo from '../../assets/logo.svg'

import './style.css'
import Api from '../../services/api';


interface Item {
    id: number,
    title: string,
    image_url: string,
}

interface IBGECityResponse {
    nome: string
}


interface IBGEUFResponse {
    sigla: string
}

const CreatPoint = () => {
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUFs] = useState<string[]>([])
    const [selected, setSelected] = useState('0')
    const [city, setCity] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedPosition, setSelectedPositio] = useState<[number, number,]>([0, 0])
    const [initialPosition, setInicialPositio] = useState<[number, number,]>([0, 0])
    const [formData, setFormData] = useState({ name: '', email: '', whatsaap: '' })
    const [selectedItems, setSelectedItems] = useState<number[]>([])



    const history = useHistory()


    useEffect(() => {
        Api.get('items').then(response => {
            setItems(response.data)
            console.log(response);
        })
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInicialPositio([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const uf_initials = response.data.map(uf => uf.sigla)
                setUFs(uf_initials)
            })
    }, [])

    useEffect(() => {
        if (selected === '0') {
            return
        }
        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selected}/distritos`)
            .then(response => {
                console.log(response);

                const cityname = response.data.map(city => city.nome)
                setCity(cityname)
            })
    }, [selected]);


    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelected(uf)
    };


    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelectedCity(city)
    };

    function handleMap(event: LeafletMouseEvent) {
        setSelectedPositio([event.latlng.lat, event.latlng.lng]);

    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        console.log(name, value)

        setFormData({ ...formData, [name]: value })
    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const {
            name, email, whatsaap
        } = formData;

        const uf = selected;
        const city = selectedCity;

        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;
        const data = {
            name, email, whatsaap,
            uf, city,
            items,
            latitude,
            longitude,
        }
        try {
            await Api.post('points', data)
            alert('Ponto de coleta criado')
            history.push('/')
        } catch (error) {
            console.log(error)
            alert('Erro ao criar ponto de coleta')
        }


    }

    function handleClickItem(item: number) {
        const a = selectedItems.findIndex(a => a === item)
        if (a >= 0) {
            const filter = selectedItems.filter(a => a !== item);
            return setSelectedItems(filter)
        }
        return setSelectedItems([...selectedItems, item])


    }
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>


            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend><h2> Dados</h2></legend>
                </fieldset>

                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input type="text"
                        name="name"
                        id="name"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="field-group">

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="whatsaap">Whatsaap</label>
                        <input type="text"
                            name="whatsaap"
                            id="whatsapp"
                            onChange={handleInputChange}
                        />
                    </div>



                </div>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map zoom={15} center={initialPosition} onClick={handleMap}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                value={selected}
                                name="uf" id="uf"
                                onChange={handleSelectedUf}
                            >
                                <option value="0"> Selecione uma UF</option>

                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>

                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectedCity}
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {city.map(ct => (
                                    <option key={ct} value={ct}>{ct}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <div className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleClickItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}


                    </div>
                </fieldset>

                <button type="submit"> Cadastrar ponto de coleta</button>
            </form>
        </div>

    )
}

export default CreatPoint;
