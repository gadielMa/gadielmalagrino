# Configuración de Mercado Pago para Donaciones

## 🎯 Estado Actual
- ✅ Sección de donaciones agregada al sitio web
- ✅ Interfaz de usuario completamente funcional
- ✅ Integración temporal con WhatsApp
- ⏳ Pendiente: Integración directa con Mercado Pago

## 📋 Pasos para Integrar Mercado Pago

### 1. Crear Cuenta de Mercado Pago Developers
1. Ve a [https://developers.mercadopago.com](https://developers.mercadopago.com)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación
4. Obtén tus credenciales:
   - **Public Key** (para el frontend)
   - **Access Token** (para el backend)

### 2. Configurar Backend (Requerido)
Para procesar pagos necesitas un backend. Opciones:

#### Opción A: Servidor Node.js Simple
```javascript
// server.js
const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar Mercado Pago
mercadopago.configure({
    access_token: 'TU_ACCESS_TOKEN'
});

// Endpoint para crear preferencia de pago
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, description } = req.body;
        
        const preference = {
            items: [{
                title: description,
                unit_price: amount,
                quantity: 1,
                currency_id: 'ARS'
            }],
            back_urls: {
                success: 'https://gadielmalagrino.com/success',
                failure: 'https://gadielmalagrino.com/failure',
                pending: 'https://gadielmalagrino.com/pending'
            },
            auto_return: 'approved'
        };
        
        const response = await mercadopago.preferences.create(preference);
        res.json({ init_point: response.body.init_point });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

#### Opción B: Netlify Functions (Serverless)
```javascript
// netlify/functions/create-payment.js
const mercadopago = require('mercadopago');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        mercadopago.configure({
            access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
        });
        
        const { amount, description } = JSON.parse(event.body);
        
        const preference = {
            items: [{
                title: description,
                unit_price: amount,
                quantity: 1,
                currency_id: 'ARS'
            }],
            back_urls: {
                success: 'https://gadielmalagrino.com/success',
                failure: 'https://gadielmalagrino.com/failure',
                pending: 'https://gadielmalagrino.com/pending'
            }
        };
        
        const response = await mercadopago.preferences.create(preference);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ init_point: response.body.init_point })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

### 3. Actualizar Frontend
Una vez que tengas el backend, actualiza el JavaScript:

```javascript
// En script.js, reemplaza la función del botón de donación:
document.getElementById('donateBtn').addEventListener('click', async () => {
    if (!selectedAmount || selectedAmount < 100) {
        alert('Por favor selecciona un monto mínimo de $100 ARS');
        return;
    }
    
    try {
        const response = await fetch('/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: selectedAmount,
                description: `Donación para Gadiel Malagrino - $${selectedAmount} ARS`
            })
        });
        
        const data = await response.json();
        
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            throw new Error('Error al crear el pago');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar el pago. Intenta nuevamente.');
    }
});
```

### 4. Páginas de Resultado
Crea páginas para manejar los resultados del pago:

#### success.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>¡Gracias por tu donación!</title>
    <meta http-equiv="refresh" content="5;url=https://gadielmalagrino.com">
</head>
<body>
    <h1>¡Donación exitosa!</h1>
    <p>Gracias por apoyar mi trabajo. Serás redirigido automáticamente...</p>
</body>
</html>
```

## 🔧 Configuración Rápida (Solución Temporal)

### Opción Simple: Link de Mercado Pago
1. Crea un link de pago en tu cuenta de Mercado Pago
2. Reemplaza la URL de WhatsApp por el link directo

```javascript
// Versión simple con link directo
const mercadoPagoLink = 'https://mpago.la/link.mercadopago.com.ar/inggadielmalagrino';
window.open(mercadoPagoLink, '_blank');
```

## 📱 Integración con WhatsApp (Actual)
Actualmente, cuando alguien hace clic en "Hacer Donación":
1. Se abre WhatsApp con un mensaje pre-escrito
2. El usuario puede solicitar el link de Mercado Pago
3. Tú respondes con el link de pago

## 🚀 Próximos Pasos Recomendados
1. **Inmediato**: Crear link de pago en Mercado Pago
2. **Corto plazo**: Implementar backend simple
3. **Largo plazo**: Integración completa con webhooks

## 📞 Soporte
Si necesitas ayuda con la implementación, contacta a través de WhatsApp con el monto que quieres configurar como donación base. 