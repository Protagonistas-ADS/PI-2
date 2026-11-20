import { Routes, Route } from "react-router-dom";

import TelaInicial from "../pages/Compartilhadas/TelaInicial";
import Catalogo from "../pages/Cliente/Catalogo";
import Cadastro from "../pages/Compartilhadas/Cadastro";
import Login from "../pages/Compartilhadas/Login";
import Perfil from "../pages/Cliente/Perfil";
import MeusPedidos from "../pages/Cliente/MeusPedidos";
import Carrinho from "../pages/Cliente/Carrinho";

import Dashboard from "../pages/Admin/Dashboard";
import PerfilAdmin from "../pages/Admin/Perfil";
import PedidosAdmin from "../pages/Admin/Pedidos";
import UsuariosAdmin from "../pages/Admin/Usuarios";
import EmBreve from "../pages/Admin/EmBreve";

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
                {/* Tabelas (Etapa 9); as que ainda não chegaram mostram "em construção" */}
                <Route path="pedidos" element={<PedidosAdmin />} />
                <Route path="usuarios" element={<UsuariosAdmin />} />
                <Route path="movimentacoes" element={<EmBreve titulo="Movimentações de estoque" />} />
                <Route path="vendas" element={<EmBreve titulo="Vendas" />} />
                <Route path="notas" element={<EmBreve titulo="Notas fiscais" />} />
                <Route path="*" element={<EmBreve titulo="Página não encontrada" />} />
            </Route>
        </Routes>
    );
}

export default Rotas;
