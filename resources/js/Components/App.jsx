import { useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    // Style inline untuk memastikan TAMPILAN PASTI TERLIHAT
    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f3f4f6', // Abu-abu muda
            fontFamily: 'sans-serif'
        }}>
            <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '0.5rem', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>
                    Hello Laravel React! 🚀
                </h1>
                <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
                    Jika Anda bisa membaca ini, React sudah berjalan!
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <button 
                        onClick={() => setCount(count - 1)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                        -
                    </button>
                    
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', width: '2rem' }}>{count}</span>
                    
                    <button 
                        onClick={() => setCount(count + 1)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;