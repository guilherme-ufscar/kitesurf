import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import ListingDetailPage from '@/pages/ListingDetailPage'
import CreateListingPage from '@/pages/CreateListingPage'
import ProfilePage from '@/pages/ProfilePage'
import ChatPage from '@/pages/ChatPage'
import FavoritesPage from '@/pages/FavoritesPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import AdminPage from '@/pages/AdminPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="busca" element={<SearchPage />} />
        <Route path="anuncio/:slug" element={<ListingDetailPage />} />
        <Route path="perfil/:id" element={<ProfilePage />} />
        <Route path="entrar" element={<LoginPage />} />
        <Route path="cadastro" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="anunciar" element={<CreateListingPage />} />
          <Route path="mensagens" element={<ChatPage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
