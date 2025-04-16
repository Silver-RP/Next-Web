"use client";

import { useEffect, useState } from "react";
import Head from "../../components/Head";
import MyAccountSidebar from "../../components/common/MyAccountSidebar";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    email: string;
    name: string;
    role?: string;
  }

const MyAccount = () => {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          setUserName(decoded.name);
        } catch (error) {
          console.error("Error decoding token:", error);
          setUserName(null);
        }
      }
    }, []);

  return (
    <>
    <Head title="My Account" />

      <main className="">
        <div className="mb-4 pb-4"></div>
        <section className="my-account container">
          <h2 className="page-title">My Account</h2>
          <div className="row">
            <MyAccountSidebar />
            <div className="col-lg-9">
              <div className="page-content my-account__dashboard">
                <p>
                  Hello <strong className="fs-4"> {userName}</strong>
                </p>
                <p>
                  From your account dashboard you can view your{" "}
                  <a className="unerline-link" href="account_orders.html">
                    recent orders
                  </a>
                  , manage your{" "}
                  <a className="unerline-link" href="account_edit_address.html">
                    shipping addresses
                  </a>
                  , and{" "}
                  <a className="unerline-link" href="account_edit.html">
                    edit your password and account details.
                  </a>
                </p>
              </div>
            MyAccountSidebar</div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyAccount;
