import { useState } from "react"

const Configuracoes = () => {

  const [titulo,setTitulo] = useState("")
  const [descricao,setDescricao] = useState("")
  const [perguntas,setPerguntas] = useState("")
  const [finalizada,setFinalizada] = useState("")

  return (
    <div>
      <h1>Pesquisas POST</h1>
      <div className="add-pesquisa">
        <form>
          <label>
            <span>Titulo</span>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
          </label>
          <label>
            <span>Descricao</span>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
          </label>
          <label>
            <span>Perguntas</span>
            <input type="text" value={perguntas} onChange={(e) => setPerguntas(e.target.value)}/>
          </label>
          <input type="submit" value="Enviar"/>
        </form>
      </div>
    </div>
  )
}

export default Configuracoes