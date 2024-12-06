import React,{createContext} from 'react'

export const AppContext=createContext();

//creating context api for global transmission of required props to every components
const ContextAPI = ({children}) => {

    const value ={

    }

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  )
}

export default ContextAPI
