import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import { Home } from './pages/home/Home';
import { LoginCard } from './pages/auth/Login';
import { RegisterCard } from './pages/auth/RegisterCard';

// Point d'entrée principal de l'application SolidJS
render(() => (
    <Router>
        <Route path="/" component={Home} />
        <Route path="/login" component={LoginCard} />
        <Route path="/register" component={RegisterCard} />
    </Router>
)
    , document.getElementById('app')!);
