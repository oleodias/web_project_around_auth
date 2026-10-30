import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App.jsx';

// Sem o <StrictMode>: em desenvolvimento ele monta os componentes duas vezes,
// e as solicitações iniciais apareceriam em dobro na aba Rede. O checklist
// pede que usuário e cartões sejam pedidos uma vez só, na montagem.
createRoot(document.getElementById('root')).render(<App />);
