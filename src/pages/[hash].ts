import { GetServerSideProps } from 'next'
import { Url } from "@/mongo/models/url";

export const getServerSideProps: GetServerSideProps = async (context) => {

    const url = await Url.findOne({ hash: context.params.hash});
    
    if(url) {
        return {
            redirect: {
                destination: url.url,
                permanent: false,
            },
        }
    }



  return {
    props: { message: "Página não encontrada." }, 
  }
}



export default function Hash({message}: {message: string}) {
    return (
        message
    )
}
