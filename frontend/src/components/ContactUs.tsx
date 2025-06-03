import { useState } from "react";
import emailjs from "emailjs-com";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
        destination:""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmail = (e: any) => {
        e.preventDefault();

        emailjs.send(
            "service_vbnhc8t", // Replace with your EmailJS service ID
            "template_3k977dv", // Replace with your EmailJS template ID
            {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                destination: formData.destination,
            },
            "Df8kmPTF9MyzGtbVd" // Replace with your EmailJS user ID
        )
        .then((response) => {
            alert("Message sent successfully!");
            setFormData({ fullName: "", email: "", phone: "", message: "", destination:"" });
        })
        .catch((error) => {
            console.error("Error sending email:", error);
            alert("Failed to send message. Try again later.");
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white text-gray-900">
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800">Contact Us</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-blue-700">Get in Touch</h2>
                            <form className="space-y-6" onSubmit={sendEmail}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred location</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        value={formData.destination}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Prefered Location"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Type your message here..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="rounded-lg w-full py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-blue-700">Our Offices</h2>
                            <div className="space-y-8">
                                {["London", "New York", "Singapore"].map((city, index) => (
                                    <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                        <h3 className="text-xl font-semibold mb-2 text-blue-800">{city}</h3>
                                        <p className="text-gray-600">Address details for {city}</p>
                                        <p className="text-gray-600 mt-2">Contact number</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold mb-6 text-blue-700">Business Hours</h2>
                                <p className="text-gray-600">Monday - Friday: 9:00 AM - 8:00 PM</p>
                                <p className="text-gray-600">Saturday: 10:00 AM - 6:00 PM</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
