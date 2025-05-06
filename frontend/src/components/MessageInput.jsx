import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";


const SECRET_PASSPHRASE = import.meta.env.VITE_SECRET_PASSPHRASE; // can be user-provided or stored securely
console.log("Tarak Debug SECRET_PASSPHRASE:", import.meta.env.VITE_SECRET_PASSPHRASE);

// Encrypt
const encryptText = (plainText) => 
  {
  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  // Derive a key using PBKDF2 (more secure than using raw key)
  const key = CryptoJS.PBKDF2(SECRET_PASSPHRASE, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
  // Generate a random IV
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv });

  // Encode salt + iv + ciphertext as a single string (e.g. Base64 JSON)
  const result = {
    ciphertext: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex),
    salt: salt.toString(CryptoJS.enc.Hex),
  };

  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(result)));
};


// Decrypt
const decryptText = (encryptedBase64) => {
  try {
    const encryptedJson = JSON.parse(CryptoJS.enc.Base64.parse(encryptedBase64).toString(CryptoJS.enc.Utf8));

    const salt = CryptoJS.enc.Hex.parse(encryptedJson.salt);
    const iv = CryptoJS.enc.Hex.parse(encryptedJson.iv);
    const ciphertext = encryptedJson.ciphertext;

    const key = CryptoJS.PBKDF2(SECRET_PASSPHRASE, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "[Error decrypting]";
  }
};






const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: encryptText(text.trim()),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
