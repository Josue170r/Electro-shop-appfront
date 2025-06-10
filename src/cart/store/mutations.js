export default {
    setArticulos: (state, articulos) => {
        console.log(articulos)
        state.articulos = articulos
    },
    setSelectedArticle: (state, article) => {
        state.selectedArticle = article
    }
}