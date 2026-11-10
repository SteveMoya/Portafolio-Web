import { useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
	id: string;
	text: string;
	sender: 'user' | 'bot';
	timestamp: Date;
}

export default function ChatbotWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			text: '¡Hola! 👋 Soy un asistente de IA. ¿En qué puedo ayudarte?',
			sender: 'bot',
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: input,
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		setTimeout(() => {
			const botMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: 'Gracias por tu mensaje. Estoy siendo entrenado para responder preguntas sobre el portafolio. Por ahora, puedes conocer más sobre mí navegando las diferentes secciones del sitio.',
				sender: 'bot',
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, botMessage]);
			setIsLoading(false);
		}, 800);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 20 }}
						transition={{ duration: 0.3, ease: 'easeOut' }}
						className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-96"
					>
						{/* Header */}
						<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
							<div>
								<h3 className="font-bold text-white">Asistente IA</h3>
								<p className="text-xs text-blue-100">
									Conectado • Responde en tiempo real
								</p>
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
								aria-label="Cerrar chat"
							>
								<X size={20} />
							</button>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className={`flex ${
										message.sender === 'user'
											? 'justify-end'
											: 'justify-start'
									}`}
								>
									<div
										className={`max-w-xs px-4 py-2 rounded-lg ${
											message.sender === 'user'
												? 'bg-blue-600 text-white rounded-br-none'
												: 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
										}`}
									>
										<p className="text-sm leading-relaxed">
											{message.text}
										</p>
										<p
											className={`text-xs mt-1 ${
												message.sender === 'user'
													? 'text-blue-200'
													: 'text-slate-500'
											}`}
										>
											{message.timestamp.toLocaleTimeString('es-DO', {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</p>
									</div>
								</motion.div>
							))}

							{isLoading && (
								<div className="flex justify-start">
									<div className="bg-slate-800 text-slate-100 px-4 py-3 rounded-lg border border-slate-700">
										<div className="flex gap-2">
											<div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
											<div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-100"></div>
											<div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-200"></div>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Input */}
						<div className="border-t border-slate-700 p-4 bg-slate-900/80 rounded-b-2xl">
							<div className="flex gap-2">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Escribe un mensaje..."
									className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
									disabled={isLoading}
								/>
								<button
									onClick={handleSend}
									disabled={isLoading || !input.trim()}
									className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
									aria-label="Enviar mensaje"
								>
									<Send size={18} />
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Floating Button */}
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				animate={{
					boxShadow: isOpen
						? '0 0 30px rgba(168, 85, 247, 0.6)'
						: '0 0 20px rgba(59, 130, 246, 0.4)',
				}}
				className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 ${
					isOpen
						? 'bg-purple-600 hover:bg-purple-700'
						: 'bg-blue-600 hover:bg-blue-700'
				} text-white`}
				aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
			>
				<motion.div
					animate={{ rotate: isOpen ? 90 : 0 }}
					transition={{ duration: 0.3 }}
				>
					{isOpen ? (
						<X size={24} />
					) : (
						<MessageCircle size={24} />
					)}
				</motion.div>
			</motion.button>
		</div>
	);
}
