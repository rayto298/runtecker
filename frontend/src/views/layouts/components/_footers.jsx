import { Link } from "react-router-dom";
import { RoutePath } from "config/route_path";

export const _Footers = () => {
  return (
    <footer className="bg-gray-400 text-white p-12">
      <h3 className="py-2 font-semibold text-xl mb-3">
        RUNTECKER(ランテッカー)
      </h3>
      <ul className="flex gap-3 text-sm">
        <li className="mb-4">運営サービスについて</li>
      </ul>
      <ul className="flex gap-3 mb-4 text-sm">
        <li>
          <Link to={RoutePath.AboutUs.path}>運営メンバー</Link>
        </li>
        <li>
          <Link to={RoutePath.TermsOfUse.path}>利用規約</Link>
        </li>

        <li>
          <Link to={RoutePath.PrivacyPolicy.path}>プライバシーポリシー</Link>
        </li>
      </ul>
      <p className="">© Stand Up F_taka Inc. All Rights Reserved.</p>
    </footer>
  );
};
