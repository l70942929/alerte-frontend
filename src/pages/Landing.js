import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  Sun,
  Moon,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Bell,
  UserPlus,
  Verified,
  Send,
  Menu,
  X,
  ArrowRight,
  LogIn,
  Award,
  Heart,
  Phone,
  Mail,
  Flag,
} from 'lucide-react';
import Logo from '../components/Logo';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const alertes = [
    {
      image: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=800&q=80',
      type: 'ENLÈVEMENT',
      lieu: 'Douala — il y a 10 min',
      titre: 'Enlèvement signalé à Bonanjo',
      desc: 'Signalement reçu et transmis aux autorités compétentes.',
      statut: 'Urgent',
      sc: 'urgent',
    },
    {
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
      type: 'DISPARITION',
      lieu: 'Yaoundé — il y a 2 h',
      titre: 'Enfant porté disparu à Bastos',
      desc: 'Recherche en cours avec diffusion des informations.',
      statut: 'En cours',
      sc: 'en-cours',
    },
    {
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80',
      type: 'OBJET RETROUVÉ',
      lieu: 'Bafoussam — aujourd\'hui',
      titre: 'Documents officiels retrouvés',
      desc: 'Documents officiels remis au centre de collecte communautaire.',
      statut: 'Nouveau',
      sc: 'nouveau',
    },
  ];

  const communityImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80',
  ];

  const steps = [
    { icon: UserPlus, title: 'Créer un compte', desc: 'Un accès personnel pour signaler et suivre les alertes.', color: '#e74c3c' },
    { icon: MapPin, title: 'Localiser', desc: 'Ajoutez un lieu précis ou utilisez votre position GPS.', color: '#3498db' },
    { icon: Verified, title: 'Vérifier', desc: 'Les modérateurs contrôlent les informations reçues.', color: '#2ecc71' },
    { icon: Send, title: 'Diffuser', desc: 'Les alertes validées sont partagées à toute la communauté.', color: '#f39c12' },
  ];

  const features = [
    { icon: Shield, title: 'Sécurisé', desc: 'Toutes les données sont protégées et confidentielles.' },
    { icon: Clock, title: 'Rapide', desc: 'Traitement des alertes en moins de 15 minutos.' },
    { icon: Award, title: 'Fiable', desc: '98% des alertes sont vérifiées et authentifiées.' },
    { icon: Heart, title: 'Communautaire', desc: 'Une plateforme solidaire et engagée.' },
  ];

  return (
    <div className={`land ${darkMode ? 'dark-mode' : ''}`}>

      <header className={`land-hdr ${scrolled ? 'scrolled' : ''}`}>
        <div className="land-hdr-in">
          <a className="logo" href="/">
            <Logo size={38} variant="full" />
          </a>

          <nav className="land-nav">
            <a href="#alertes">Alertes</a>
            <a href="#comment">Fonctionnement</a>
            <a href="#features">Caractéristiques</a>
            <a href="#community">Communauté</a>
          </nav>

          <div className="land-hdr-btns">
            {isLoggedIn ? (
              <button className="btn-prim" onClick={() => navigate('/accueil')}>
                Accéder à mon Dashboard
              </button>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => navigate('/connexion')}>
                  <LogIn size={18} />
                  Se connecter
                </button>
                <button className="btn-prim" onClick={() => navigate('/inscription')}>
                  <UserPlus size={18} />
                  Créer un compte
                </button>
              </>
            )}
            <button className="theme-btn-landing" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="hamburger-landing" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ... le reste du code reste identique ... */}
    </div>
  );
}

export default Landing;