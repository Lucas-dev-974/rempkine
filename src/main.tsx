import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import { Authentication } from './pages/auth/Authentication';
import { Home } from './pages/home/Home';

// Point d'entrée principal de l'application SolidJS
render(() => (
    <Router>
        <Route path="/" component={Home} />
        <Route path="/login" component={Authentication} />
        <Route path="/register" component={Authentication} />
    </Router>
)
    , document.getElementById('app')!);
