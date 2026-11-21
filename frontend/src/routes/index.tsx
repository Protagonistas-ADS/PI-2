import { Routes, Route } from "react-router-dom";

import TelaInicial from "../pages/Compartilhadas/TelaInicial";
import Catalogo from "../pages/Cliente/Catalogo";
import Cadastro from "../pages/Compartilhadas/Cadastro";
import Login from "../pages/Compartilhadas/Login";
import Perfil from "../pages/Cliente/Perfil";
import MeusPedidos from "../pages/Cliente/MeusPedidos";
import Carrinho from "../pages/Cliente/Carrinho";
import NaoEncontrada from "../pages/Compartilhadas/NaoEncontrada";

import Dashboard from "../pages/Admin/Dashboard";
import PerfilAdmin from "../pages/Admin/Perfil";
import PedidosAdmin from "../pages/Admin/Pedidos";
import UsuariosAdmin from "../pages/Admin/Usuarios";
import MovimentacoesAdmin from "../pages/Admin/Movimentacoes";
import VendasAdmin from "../pages/Admin/Vendas";
import NotasAdmin from "../pages/Admin/Notas";
import NaoEncontradaAdmin from "../pages/Admin/NaoEncontrada";

import RotaProtegida from "../components/RotaProtegida";
import RotaPublica from "../components/RotaPublica";
import LayoutAdmin from "../components/LayoutAdmin";

function Rotas() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RotaPublica>
                        <TelaInicial />
                    </RotaPublica>
                }
            />
            <Route
                path="/cadastro"
                element={
                    <RotaPublica>
                        <Cadastro />
                    </RotaPublica>
                }
            />
            <Route
                path="/login"
                element={
                    <RotaPublica>
                        <Login />
                    </RotaPublica>
                }
            />
            {/* Catálogo é público: o visitante vê os produtos sem login */}
            <Route path="/catalogo" element={<Catalogo />} />
            {/* Carrinho também é público; o login é pedido só para enviar o pedido */}
            <Route path="/carrinho" element={<Carrinho />} />

            {/* Telas do cliente (o admin que tentar abrir vai para o painel) */}
            <Route
                path="/perfil"
                element={
                    <RotaProtegida perfil="cliente">
                        <Perfil />
                    </RotaProtegida>
                }
            />
            <Route
                path="/clientePedidos"
                element={
                    <RotaProtegida perfil="cliente">
                        <MeusPedidos />
                    </RotaProtegida>
                }
            />

            {/* Painel do administrador (o cliente que tentar abrir volta para o catálogo) */}
            <Route
                path="/admin"
                element={
                    <RotaProtegida perfil="administrador">
                        <LayoutAdmin />
                    </RotaProtegida>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="perfil" element={<PerfilAdmin />} />
                {/* Tabelas do administrador (Etapa 9) */}
                <Route path="pedidos" element={<PedidosAdmin />} />
                <Route path="usuarios" element={<UsuariosAdmin />} />
                <Route path="movimentacoes" element={<MovimentacoesAdmin />} />
                <Route path="vendas" element={<VendasAdmin />} />
                <Route path="notas" element={<NotasAdmin />} />
                <Route path="*" element={<NaoEncontradaAdmin />} />
            </Route>

            {/* Qualquer outro endereço: página 404 do site */}
            <Route path="*" element={<NaoEncontrada />} />
        </Routes>
    );
}

export default Rotas;
