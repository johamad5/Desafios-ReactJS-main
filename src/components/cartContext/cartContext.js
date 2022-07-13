import { useState, useEffect, createContext } from "react";
import Swal from "sweetalert2";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [unidades, setUnidades] = useState(0);

  const addItem = (addProduc) => {
    if (!cart.some((art) => art.id === addProduc.id)) {
      setCart([...cart, addProduc]);
    } else {
      const artic = cart.find((art) => art.id === addProduc.id);
      artic.quantity = artic.quantity + addProduc.quantity;
      setCart([...cart]);
    }

    const notificacion = Swal.mixin({
      toast: true,
      position: "center-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    notificacion.fire({
      icon: "info",
      title: `Producto agregado al carrito`,
    });
  };

  const lessUnits = (productId) => {
    const artic = cart.find((art) => art.id === productId);
    if (artic.quantity > 1) {
      artic.quantity--;
      setCart([...cart]);

      const notificacion = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      notificacion.fire({
        icon: "info",
        title: `Se quitó una unidad de: ${artic.nombre}`,
      });
    }
  };

  const deleteItem = (id) => {
    const cartProducts = cart.filter((product) => product.id !== id);
    const products = cart.find((product) => product.id === id);
    setCart(cartProducts);

    const notificacion = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    notificacion.fire({
      icon: "warning",
      title: `Se eliminó el producto: ${products.nombre}`,
    });
  };

  const deleteCart = () => {
    const cartProducts = [];
    setCart(cartProducts);
  };

  useEffect(() => {
    let unidades = 0;
    cart.forEach((art) => {
      unidades += art.quantity;
    });
    setUnidades(unidades);
  }, [cart]);

  const totalCartValue = () => {
    let totalValue = 0;
    cart.forEach((art) => {
      totalValue += art.quantity * art.precio;
    });
    return totalValue;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        lessUnits,
        addItem,
        deleteItem,
        deleteCart,
        unidades,
        totalCartValue,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
