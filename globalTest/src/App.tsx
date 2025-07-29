import './App.css'
import RootLayout from './Layout'
function App() {

  return (
    <>
      <RootLayout />
    </>
  )
}

export default App
/*
[Button Click] 
    ↓
[fetchData('/400')] 
    ↓
[commsHubApi.get('/400')]
    ↓
[Axios HTTP Request to server]
    ↓
[Server returns 400 status]
    ↓
[Axios throws error]
    ↓
[Response Interceptor catches error]
    ↓
[Extracts status code: 400]
    ↓
[Calls globalRedirectHandler(400)]
    ↓
[Navigation function executes]
    ↓
[navigate('/400')]
    ↓
[React Router redirects to error page]
*/