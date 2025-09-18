# PillPal

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-C7F?logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?logo=springboot&logoColor=white)

**PillPal** es una aplicación web para **trackear la toma de medicamentos** de varias personas. Permite crear cuentas, registrar medicamentos, programar recordatorios y controlar la ingesta diaria según las indicaciones.

<div align="center">
  <img src="https://github.com/user-attachments/assets/b770bbff-1f24-4ec1-9222-d026918c838b" width="300" height="300" alt="pillpal" />
</div>

---

## 🔹 Características principales

- Registro de medicamentos con persistencia de datos.
- Listado de medicamentos activos y opción de marcarlos como "tomado".
- Visualización del estado de los medicamentos según la hora del día.
- Creación y gestión de cuentas de usuario.
- Separación de frontend y backend con consumo de API REST.
- Interfaz moderna y responsiva.

---

## 🛠 Tecnologías utilizadas

- **Frontend:** React + Vite  
- **Backend:** Spring Boot (repositorio separado)  
- **Base de datos:** MySQL  
- **Consumo de API REST:** Axios / Fetch  
- **Gestión de estado:** React Context / Hooks

---

## ⚡ Instalación y despliegue (Frontend)

1. **Clonar el repositorio:**

```bash
git clone https://github.com/tu-usuario/pillpal-frontend.git
cd pillpal-frontend
```
2. **Instalar dependencias:**
```bash
npm install
```
3. **Configurar variables de entorno:**
```bash
VITE_API_URL=http://localhost:8080/api
```
4. **Iniciar la aplicación en modo desarrollo:**
```bash
npm run dev
```
5. **Construir para producción:**
```bash
npm run build
```
## 🔗 Integración con Backend

El backend se encuentra en un repositorio separado y ofrece API REST para:

- Crear y gestionar usuarios.
- Registrar medicamentos y sus dosis.
- Actualizar el estado de los medicamentos.
- Consultar el historial de tomas.

## 👥 Integrantes del departamento:
- Irina Tiron | FemMad
- Angelina Pereira | FemMad
- Mio Ogura | FemBcn
- Miguel Ballesteros | DigiAst



