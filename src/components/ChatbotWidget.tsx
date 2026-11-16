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
			text: '🚧 Esta funcionalidad está actualmente en desarrollo. Pronto podrás conversar con el asistente de IA.',
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
		<div className="fixed bottom-8 right-7 z-50 flex flex-col items-end gap-4 print:hidden">
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
						className="flex h-96 w-[calc(100vw-3rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] font-poppins text-[whitesmoke] shadow-2xl shadow-black/60"
						role="dialog"
						aria-label="Asistente IA"
					>
						{/* Header */}
						<div className="flex items-center justify-between border-b border-white/10 border-t-2 border-t-[#c70039] bg-white/[0.03] px-4 py-3">
							<div>
								<h3 className="text-sm font-black uppercase tracking-tight text-white">
									Asistente IA
								</h3>
								<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
									En desarrollo
								</p>
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="rounded-full p-1.5 text-white/60 transition-colors duration-300 hover:bg-white/10 hover:text-[#c70039]"
								aria-label="Cerrar chat"
							>
								<X size={18} />
							</button>
						</div>

						{/* Messages */}
						<div className="flex-1 space-y-4 overflow-y-auto p-4">
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className={`flex ${
										message.sender === 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-[85%] rounded-2xl px-4 py-2 ${
											message.sender === 'user'
												? 'rounded-br-sm bg-[#c70039] text-white'
												: 'rounded-bl-sm border border-white/10 bg-white/[0.04] text-white/90'
										}`}
									>
										<p className="text-sm leading-relaxed">{message.text}</p>
										<p
											className={`mt-1 text-[10px] ${
												message.sender === 'user' ? 'text-white/70' : 'text-white/40'
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
									<div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-3">
										<div className="flex gap-2">
											<div className="h-2 w-2 animate-pulse rounded-full bg-white/40"></div>
											<div className="h-2 w-2 animate-pulse rounded-full bg-white/40 delay-100"></div>
											<div className="h-2 w-2 animate-pulse rounded-full bg-white/40 delay-200"></div>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Input */}
						<div className="border-t border-white/10 bg-white/[0.03] p-3">
							<div className="flex gap-2">
								<input
									type="text"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder="Próximamente..."
									className="flex-1 rounded-full border border-white/10 bg-[#0a0a0a] px-4 py-2 text-sm text-white placeholder-white/30 transition-colors focus:border-[#c70039] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
									disabled
								/>
								<button
									onClick={handleSend}
									disabled
									className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c70039] text-white transition-colors duration-300 hover:bg-[#b11141] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
									aria-label="Enviar mensaje"
								>
									<Send size={16} />
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
				className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/50 transition-colors duration-300 ${
					isOpen
						? 'border border-white/20 bg-[#0a0a0a] hover:border-[#c70039] hover:text-[#c70039]'
						: 'bg-[#c70039] hover:bg-[#b11141]'
				}`}
				aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
				aria-expanded={isOpen}
			>
				<motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
					{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
				</motion.div>
			</motion.button>
		</div>
	);
}
