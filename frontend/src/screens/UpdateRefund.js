import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateRefund() {
  const { refundid } = useParams();
  const navigate = useNavigate();

  const [refundData, setRefundData] = useState({
    bookingid: "",
    amount: "",
    refundDate: "",
    bankName: "",
    branch: "",
    bankHolderName: "",
    accountNo: "",
  });

  useEffect(() => {
    const fetchRefundDetails = async () => {
      try {
        const response = await axios.get(`/api/refunds/getbyid/${refundid}`);
        if (response.data) {
          const refund = response.data;
          const formattedDate = new Date(refund.refundDate)
            .toISOString()
            .split("T")[0];
          setRefundData({ ...refund, refundDate: formattedDate });
        }
      } catch (error) {
        console.error("Error fetching refund details:", error);
        alert("Failed to fetch refund details.");
      }
    };

    fetchRefundDetails();
  }, [refundid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRefundData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];

    if (!refundData.amount || refundData.amount <= 0) {
      errors.push("Refund amount must be a positive number.");
    }
    if (!refundData.refundDate) {
      errors.push("Refund date is required.");
    }
    if (!refundData.bankName.trim()) {
      errors.push("Bank name is required.");
    }
    if (!refundData.branch.trim()) {
      errors.push("Branch is required.");
    }
    if (!refundData.bankHolderName.trim()) {
      errors.push("Account holder name is required.");
    }
    if (!refundData.accountNo.trim()) {
      errors.push("Account number is required.");
    } else if (!/^\d{6,20}$/.test(refundData.accountNo)) {
      errors.push("Account number must be 6-20 digits.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      await axios.put(`/api/refunds/update/${refundid}`, refundData);
      alert("Refund updated successfully!");
      navigate("/admin/refunds");
    } catch (error) {
      console.error("Error updating refund:", error);
      alert("Failed to update refund.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="update-form">
        <h2>
          <center>Update Refund</center>
        </h2>

        <label>Refunded Amount:</label>
        <input
          type="number"
          name="amount"
          value={refundData.amount}
          onChange={handleChange}
          required
        />

        <label>Refunded Date:</label>
        <input
          type="date"
          name="refundDate"
          value={refundData.refundDate}
          onChange={handleChange}
          required
        />

        <label>Bank Name:</label>
        <input
          type="text"
          name="bankName"
          value={refundData.bankName}
          onChange={handleChange}
          required
        />

        <label>Branch:</label>
        <input
          type="text"
          name="branch"
          value={refundData.branch}
          onChange={handleChange}
          required
        />

        <label>Account Holder Name:</label>
        <input
          type="text"
          name="bankHolderName"
          value={refundData.bankHolderName}
          onChange={handleChange}
          required
        />

        <label>Account Number:</label>
        <input
          type="text"
          name="accountNo"
          value={refundData.accountNo}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Update Refund
        </button>
      </form>

      <style>
        {`
        .update-form {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color:rgb(153, 213, 235);
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .update-form label {
          font-weight: bold;
          margin-top: 10px;
        }

        .update-form input,
        .update-form select,
        .update-form textarea {
          padding: 10px;
          font-size: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }

        .update-form input:focus,
        .update-form select:focus,
        .update-form textarea:focus {
          border-color: #007bff;
        }

        .btn {
          margin-top: 20px;
          padding: 12px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background-color: #0056b3;
        }
      `}
      </style>
    </div>
  );
}

export default UpdateRefund;
