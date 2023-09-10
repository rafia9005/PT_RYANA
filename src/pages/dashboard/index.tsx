import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavbarLayout from "@/components/Layouts/NavbarLayout";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import Head from "next/head";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import app from "@/lib/firebase";

type ProductData = {
  id: string;
  name: string;
  price: number;
  desc: string;
  linkImage: string;
  chatText: string;
};

type FormData = {
  id: string;
  name: string;
  price: string;
  desc: string;
  chatText: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    price: "",
    desc: "",
    chatText: "", // Initialize chatText field
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchProducts();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const db = getFirestore(app);
      const productCollection = collection(db, "products");
      const productQuery = query(productCollection);
      const productSnapshot = await getDocs(productQuery);

      const productData: ProductData[] = [];

      productSnapshot.forEach((doc) => {
        const data = doc.data();
        productData.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          desc: data.desc,
          linkImage: data.linkImage,
          chatText: data.chatText, // Fetch chatText field
        });
      });

      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageFile) {
      const storage = getStorage(app);
      const imageRef: StorageReference = ref(
        storage,
        `images/${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      setImageUrl(imageUrl);

      try {
        const db = getFirestore(app);
        const docRef = await addDoc(collection(db, "products"), {
          id: formData.id,
          name: formData.name,
          price: formData.price,
          desc: formData.desc,
          linkImage: imageUrl,
          chatText: formData.chatText, // Add chatText field to Firestore
        });

        setSubmissionMessage("Data has been successfully submitted!");

        setFormData({
          id: "",
          name: "",
          price: "",
          desc: "",
          chatText: "", // Clear chatText field
        });
        setImageFile(null);
        setImageUrl(null);

        fetchProducts();
      } catch (error) {
        console.error("Error adding document: ", error);
        setSubmissionMessage("Error: Data submission failed.");
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const db = getFirestore(app);
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full border-4 border-current border-r-transparent h-20 w-20"></div>
      </div>
    );
  }
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
        <title>Dashboard - PT. Ryana Asta Jaya</title>
      </Head>
      <NavbarLayout>
        <div className="mt-24 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">
              Welcome, {user?.displayName}!
            </h1>
            <Link href="/logout">
              <p className="text-blue-500 hover:underline">Logout</p>
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700">ID:</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700">Price:</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="text-gray-700">Description:</label>
                  <textarea
                    value={formData.desc}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                    rows={4}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700">Chat Text:</label>
                  <input
                    type="text"
                    value={formData.chatText}
                    onChange={(e) =>
                      setFormData({ ...formData, chatText: e.target.value })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-700">Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Add Product
              </button>
            </form>
            {submissionMessage && (
              <p className="mt-4 text-green-600">{submissionMessage}</p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Product List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left bg-gray-200">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Chat Text</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-2">{product.desc}</td>
                      <td className="px-4 py-2">
                        <a
                          href={product.linkImage}
                          className="text-blue-500 hover:underline"
                        >
                          Image
                        </a>
                      </td>
                      <td className="px-4 py-2">{product.chatText}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </NavbarLayout>
    </>
  );
}
