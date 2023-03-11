import axios from 'axios';
import type { GetServerSideProps, NextPage } from "next";
const regex = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;


async function handleShortenUrl(host: string) {
  const url = document.querySelector('#url') as HTMLInputElement
  
  if(regex.test(url.value) === false) return alert('URL inválida')
  const shortURL = await axios.post(`api/encurtar`, {
    url: url.value,
  }).catch(err => console.log(err))

  url.value = shortURL ? `${host}/${shortURL.data.hash}` : ''
}

export const getServerSideProps: GetServerSideProps = async (context) => {

return {
  props: {host: context.req.headers.host} , 
}
}

export default function Home({host}: {host: string}) {

  return (
    <>
        <div className='w-screen h-screen flex justify-center items-center bg-slate-50'>
            <div className='max-w-lg w-full'>   
                <div className="relative">
                    <input type="text" id="url" className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite a url aqui." required/>
                    <button onClick={() => handleShortenUrl(host)} type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Encurtar</button>
                </div>
            </div>
        </div>
    </>
  )
}