import "./App.css";
import QRCode from "react-qr-code";
import "./styles/index.css";
import { Route, Routes, BrowserRouter } from "react-router";
import Home from "./pages/home";
import Label from "./pages/label";
import PrintLabel from "./pages/printLabel";
import TrackingDelivery from "./pages/trackingDelivery";
import ScanQR from "./pages/scanQR";
import MainLayout from "./components/body";
import LabelPage from "./pages/LabelPage";
import UniqueCodePage from "./pages/UniqueLabel";
import Login from "./pages/login";
import GuestOnly from "./middlewares/guestOnly.jsx";
import RegisterPage from "./pages/register.jsx";
import ScannerPage from "./pages/scannerPage.jsx";
import UpdateData from "./pages/updateData.jsx";
import TrackingCustomerPage from "./pages/trackingCustomer.jsx";
import UpdateCyclePage from "./pages/cycleCustomer.jsx";
import DataTrackingTable from "./components/dataTracking.jsx";
import SmartInputLoop from "./components/smartInput.jsx";
import HistoryPage from "./pages/History.jsx";
import ScanFinishPage from "./pages/scannerFinish.jsx";
import AbsensiInPage from "./pages/absensiIn.jsx";
import AbsensiOutPage from "./pages/absensiOut.jsx";
// import AbsensiPage from "./pages/absensiIn.jsx";
function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/login"
            element={
              <GuestOnly>
                {" "}
                <Login />{" "}
              </GuestOnly>
            }
          />

          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/label" element={<Label />} />
            <Route path="/printLabel" element={<LabelPage />} />
            <Route path="/updateDelivery" element={<UpdateData />} />
            <Route
              path="/printLabel/:customerId"
              element={<UniqueCodePage />}
            />
            <Route
              path="/printLabel/:customerId/:uniqueCode"
              element={<PrintLabel />}
            />
            <Route path="/scanQR" element={<ScanQR />} />
            <Route path="/scanQR/:id" element={<SmartInputLoop />} />
            <Route path="/scanFinishPrepare" element={<ScanFinishPage />} />
            {/* 
            <Route
              path="/all/history"
              element={<HistoryAll />}
            /> */}
            <Route
              path="/updateCycle/:customerId"
              element={<UpdateCyclePage />}
            />
            <Route path="/tracking" element={<TrackingDelivery />} />
            <Route
              path="/tracking/:customerId"
              element={<TrackingCustomerPage />}
            />
            <Route
              path="/tracking/:customerId/:cycleNumber"
              element={<DataTrackingTable />}
            />
            {/* <Route path="/absensi" element={<AbsensiPage />} /> */}
            <Route path="/absensi/In" element={<AbsensiInPage />} />
            <Route path="/absensi/Out" element={<AbsensiOutPage />} />
            <Route path="/scanAbsensi" element={<ScannerPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <div
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 64,
          width: "100%",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={"ini" + count}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div><PrintLabel /></div>
      <h2>Delivery System</h2>
      <ul>
        <li>Dashboard</li>
        <li></li>
      </ul>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
      {/* <Switch location={location} key={location.pathname}>
        <Route exact path="/" component={Home} />
        <Route path="/label" component={Label} />
        <Route path="/printLabel" component={printLabel} />
        <Route path="/tracking" component={TrackingDelivery} />
        <Route path="/scanQR" component={ScanQR} />
      </Switch> */}
    </>
  );
}

export default App;
