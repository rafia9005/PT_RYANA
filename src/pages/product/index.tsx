import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import NavbarLayout from "@/components/Layouts/NavbarLayout";
import FooterLayout from "@/components/Layouts/FooterLayout";

type Product = {
  id: number;
  name: string;
  price: number;
  desc: string;
  linkImage: string;
};

type ProductsResponse = {
  status: boolean;
  statusCode: number;
  data: Product[];
};

export default function Index() {
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(14);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [noResults, setNoResults] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data for products
    fetch("/api/product/route")
      .then((res) => res.json())
      .then((response: ProductsResponse) => {
        setOriginalProducts(response.data);
        setProducts(response.data);
        setIsLoadingProducts(false);
        if (response.data.length === 0) {
          setNoResults(true);
        }
      });
  }, []);

  const handleNextClick = () => {
    setStartIndex(startIndex + 15);
    setEndIndex(endIndex + 15);
  };

  const handlePrevClick = () => {
    setStartIndex(startIndex - 15);
    setEndIndex(endIndex - 15);
  };

  const handleSearch = () => {
    setIsLoadingSearch(true);

    const filteredProducts = originalProducts.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const idMatch = product.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return nameMatch || idMatch;
    });

    setTimeout(() => {
      setIsLoadingSearch(false);
      if (filteredProducts.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setProducts(filteredProducts);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  const ButtonNext = () => {
    return (
      !isLoadingProducts &&
      products.length > 15 && (
        <div className="mt-4 flex justify-center">
          {startIndex > 0 && (
            <>
              <button
                onClick={handlePrevClick}
                className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 mr-2 rounded-lg transition duration-300 ease-in-out"
              >
                Prev
              </button>
              <button
                onClick={handleNextClick}
                className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Next
              </button>
            </>
          )}
          {endIndex < products.length && (
            <button
              onClick={handleNextClick}
              className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Next
            </button>
          )}
        </div>
      )
    );
  };

  return (
    <>
      <Head>
        <title>Product - PT. Ryana Asta Jaya</title>
      </Head>
      <NavbarLayout>
        <div className="container mx-auto p-4" style={{ marginTop: "80px" }}>
          <div className="flex items-center mb-4">
            <div className="mt-2 w-full">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  product /
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
                  placeholder="cari product? "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          </div>

          {isLoadingSearch ? (
            <div className="flex justify-center items-center mt-52">
              <div
                className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
              </div>
            </div>
          ) : noResults ? (
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
          ) : (
            <>
              {isLoadingProducts ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid h-16 w-16"></div>
                </div>
              ) : (
                <div className="bg-white">
                  <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-8 mb-4">
                      Product Kami!
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                      {products.length > 0 &&
                        products
                          .slice(startIndex, endIndex)
                          .map((product: Product) => (
                            <div
                              key={product.id}
                              className="bg-gray-100 border rounded-lg overflow-hidden shadow-lg"
                            >
                              <img
                                src={product.linkImage}
                                alt={product.name}
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {product.desc}
                                </p>
                                <div className="mt-2 flex justify-between items-center">
                                  <p className="text-xl font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                  </p>
                                  <Link
                                    href={`/product/view?id=${encodeURIComponent(
                                      product.id.toString()
                                    )}`}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out"
                                  >
                                    Buy
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              )}
              <ButtonNext />
            </>
          )}
        </div>
        <div className="mt-64">
          <FooterLayout />
        </div>
      </NavbarLayout>
    </>
  );
}
