import { useEffect, useState } from 'react'
import api from '../../services/api'
import styles from './styles.module.css'

export const AllPage = () => {
    const [user, setUser] = useState(null)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullname, setFullname] = useState("")
    const [phone, setPhone] = useState("")

    const [login, setLogin] = useState(false)

    const [status, setStatus] = useState(null)

    const [btnRegister, setBtnRegister] = useState(false)

    const [btnEditContact, setBtnEditContact] = useState(false)

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem('@contacts:token')

            if (token) {
                try {
                    api.defaults.headers.authorization = `Bearer ${token}`

                    const { data } = await api.get('/contacts')

                    setUser(data)
                } catch (error) {
                    console.error(error)
                }
            }
        }

        loadUser()
    }, [login])

    async function handleSubmitLogin(event) {
        event.preventDefault()

        try {
            const token = await api.post('/login',
                { "email": email, "password": password },
                { headers: { "Content-Type": "application/json" } }
            ).then(response => response.data.token)

            localStorage.setItem('@contacts:token', token)
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSubmitRegister(event) {
        event.preventDefault()

        try {
            const response = await api.post('/users',
                { "fullname": fullname, "email": email, "password": password, "phone": phone },
                { headers: { "Content-Type": "application/json" } }
            ).then(response => response)

            setStatus(response.status)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSubmitRegisterContact(event) {
        event.preventDefault()

        const token = localStorage.getItem('@contacts:token')

        if (token) {
            try {
                api.defaults.headers = { "Content-Type": "application/json" }
                api.defaults.headers.authorization = `Bearer ${token}`

                await api.post('/contacts', {
                    "fullname": fullname,
                    "email": email,
                    "phone": phone
                })
            } catch (error) {
                console.error(error)
            }

            setLogin(!login)
        }
    }

    async function handleSubmitUpdateContact(id) {
        const token = localStorage.getItem('@contacts:token')

        if (token) {
            try {
                api.defaults.headers = { "Content-Type": "application/json" }
                api.defaults.headers.authorization = `Bearer ${token}`

                await api.patch(`/contacts/${id}`, {
                    "fullname": fullname,
                    "email": email,
                    "phone": phone
                })
            } catch (error) {
                console.error(error)
            }

            setLogin(!login)
            setBtnEditContact(!btnEditContact)
        }
    }

    async function handleDeleteContact(id) {
        const token = localStorage.getItem('@contacts:token')

        if (token) {
            try {
                api.defaults.headers.authorization = `Bearer ${token}`

                await api.delete(`/contacts/${id}`)
            } catch (error) {
                console.error(error)
            }

            setLogin(!login)
        }
    }

    function deslogar() {
        localStorage.clear()
        window.location.reload(false)
    }

    return (
        user ?
            <div>
                <div className={styles.container}>
                    <h1>Cadastre um contato</h1>
                    <form onSubmit={handleSubmitRegisterContact}>
                        <div>
                            <label htmlFor="fullname">nome completo</label>
                            <input
                                type="text"
                                id="fullname"
                                onChange={(event) => setFullname(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="email">email</label>
                            <input
                                type="email"
                                id="email"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone">telefone</label>
                            <input
                                type="text"
                                id="phone"
                                onChange={(event) => setPhone(event.target.value)}
                            />
                        </div>

                        <button type="submit" onClick={() => setLogin(!login)}>Enter</button>
                    </form>

                    <h1>Contatos de {user.fullname}</h1>

                    {user.contacts.map(contact =>
                        <div>
                            <span key={contact.id}>{contact.fullname} - {contact.email} - {contact.phone}</span>
                            <button onClick={() => handleDeleteContact(contact.id)}>Excluir</button>
                            <button onClick={() => setBtnEditContact(!btnEditContact)}>Editar</button>
                            {
                                btnEditContact &&
                                <form>
                                    <div>
                                        <label htmlFor="fullname">nome completo</label>
                                        <input
                                            type="text"
                                            id="fullname"
                                            onChange={(event) => setFullname(event.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email">email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            onChange={(event) => setEmail(event.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone">telefone</label>
                                        <input
                                            type="text"
                                            id="phone"
                                            onChange={(event) => setPhone(event.target.value)}
                                        />
                                    </div>

                                    <button onClick={() => handleSubmitUpdateContact(contact.id)}>Enviar</button>
                                </form>
                            }
                        </div>
                    )}

                    <button onClick={deslogar}>Sair</button>
                </div>
            </div>

            :

            !btnRegister ?
                <div className={styles.container}>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmitLogin}>
                        <div>
                            <label htmlFor="email">email</label>
                            <input
                                type="email"
                                id="email"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">password</label>
                            <input
                                type="password"
                                id="paswword"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <button type="submit" onClick={() => setLogin(!login)}>Enter</button>
                    </form>

                    <button onClick={() => setBtnRegister(!btnRegister)}>Cadastre-se</button>
                </div>

                :

                <div className={styles.container}>
                    <h1>Cadastre-se</h1>
                    <form onSubmit={handleSubmitRegister}>
                        <div>
                            <label htmlFor="fullname">nome completo</label>
                            <input
                                type="text"
                                id='fullname'
                                onChange={(event) => setFullname(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="email">email</label>
                            <input
                                type="email"
                                id='email'
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">password</label>
                            <input
                                type="password"
                                id='password'
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone">telefone</label>
                            <input
                                type="text"
                                id='phone'
                                onChange={(event) => setPhone(event.target.value)}
                            />
                        </div>

                        {status === 201 && <p>Cadastrado com sucesso! Faça o login!</p>}

                        <button type="submit">Cadastrar</button>
                    </form>

                    <button onClick={() => setBtnRegister(!btnRegister)}>Login</button >
                </div >
    )
}