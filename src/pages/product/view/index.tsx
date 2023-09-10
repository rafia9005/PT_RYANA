import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import NavbarLayout from "@/components/Layouts/NavbarLayout";
import FooterLayout from "@/components/Layouts/FooterLayout";

type ProductType = {
  status: boolean;
  statusCode: number;
  data: {
    id: number;
    name: string;
    price: number;
    desc: string;
    linkImage: string;
    chatText: string;
  }[];
};

export default function ProductView() {
  const router = useRouter();
  const [product, setProduct] = useState<ProductType["data"][0] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { id } = router.query;

    if (id && typeof id === "string") {
      fetch(`/api/product/view?id=${id}`)
        .then((res) => res.json())
        .then((response) => {
          setProduct(response.data);
          setLoading(false);
        });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router.query]);
  function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  return (
    <>
      <Head>
        <title>Product - {product?.id}</title>
      </Head>
      <NavbarLayout>
        <div className="container mx-auto py-8 mt-52">
          {loading ? (
            <div className="flex justify-center items-center mt-52">
              <div
                className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
              </div>
            </div>
          ) : product ? (
            <div className="flex items-center justify-center">
              <div className="max-w-lg bg-white shadow-md rounded-lg overflow-hidden">
                <img src={product.linkImage} width={600} height={400} />
                <div className="px-6 py-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-gray-600">{product.desc}</p>
                </div>
                <div className="px-6 py-2">
                  <a
                    href={`https://wa.me/6282143338737?text=${product.chatText}`}
                    className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <main className="grid mt-52 bg-white px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Product Tidak ada
                </h1>
                <p className="mt-6 text-base leading-6 text-gray-600">
                  Mohon maaf, Product yang anda cari tidak ada.
                </p>
              </div>
            </main>
          )}
        </div>
        <div className="mt-28">
          <FooterLayout />
        </div>
      </NavbarLayout>
    </>
  );
}
