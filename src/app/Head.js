import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";

export default function Head() {
  return (
    <div className="all">
      <div className="body">
        <div className="header">
            <div className="hicon"></div>
            <h1 className="h1">Contacts</h1>
        </div>
        <input type="number" className="inp" placeholder="search" />
        <div className="fav">
            <h1 className="favh">FAVOURITES</h1>
            <div className="favf">
            <div className="cirs"></div>
            <div className="cirs1"></div>
            <div className="cirs2"></div>
            <div className="cirs3"></div>
            <div className="cirs4"></div>
            </div>
        </div>
        <div className="every">
            <div className="cover">
                <div className="cir"></div>
                <h1 className="covh">
                    Richard Joe<br />
                    <span className="covs">+234 902 406 1211</span>
                </h1>
            </div>

            <div className="cover">
                <div className="cir1"></div>
                <h1 className="covh">
                    Grace Toph<br />
                    <span className="covs">+234 703 809 1317</span>
                </h1>
            </div>

            <div className="cover">
                <div className="cir2"></div>
                <h1 className="covh">
                    Alex Ray<br />
                    <span className="covs">+234 813 204 2498</span>
                </h1>
            </div>

            <div className="cover">
                <div className="cir3"></div>
                <h1 className="covh">
                    Hermes Leo<br />
                    <span className="covs">+234 703 429 7718</span>
                </h1>
            </div>

            <div className="cover">
                <div className="cir4"></div>
                <h1 className="covh">
                    Mary Neil<br />
                    <span className="covs">+234 704 429 6731</span>
                </h1>
            </div>
        </div>
      </div>
    </div>
  );
}