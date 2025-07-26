"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRoomContext } from "@/context/RoomContext";
import { Pencil } from "lucide-react";
import { Room, RoomStatus } from "@/types";
import { UpdateRoomRequest } from "../service/RoomService";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

interface EditRoomModalProps {
	isOpen: boolean;
	onClose: () => void;
	room: Room | null;
}

export function EditRoomModal({ isOpen, onClose, room }: EditRoomModalProps) {
	const { updateRoom, loading } = useRoomContext();

	const [formData, setFormData] = useState<UpdateRoomRequest>({
		id: "",
		number: "",
		type: "",
		status: "available",
		price_per_night: 0,
		description: "",
	});

	// Memoiza roomTypes para que su referencia no cambie en cada render
	const roomTypes = useMemo(
		() => [
			{ value: "individual", label: "Individual" },
			{ value: "matrimonial", label: "Matrimonial" },
			{ value: "doble", label: "Doble" },
			{ value: "triple", label: "Triple" },
			{ value: "cuadruple", label: "Cuádruple" },
			{ value: "suite", label: "Suite" },
			{ value: "familiar", label: "Familiar" },
			{ value: "ejecutiva", label: "Ejecutiva" },
		],
		[]
	);

	// Función para normalizar el tipo de habitación
	const normalizeRoomType = useCallback(
		(type: string) => {
			const normalized = type.toLowerCase().trim();
			const found = roomTypes.find(
				roomType =>
					roomType.value === normalized ||
					roomType.label.toLowerCase() === normalized
			);
			return found ? found.value : type;
		},
		[roomTypes]
	);

	useEffect(() => {
		if (room) {
			setFormData({
				id: room.id,
				number: room.number,
				type: normalizeRoomType(room.type),
				status: room.status,
				price_per_night: room.price_per_night,
				description: room.description ?? "",
			});
		}
	}, [room, normalizeRoomType]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "price_per_night" ? parseFloat(value) : value,
		}));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleStatusChange = (value: RoomStatus) => {
		setFormData((prev) => ({
			...prev,
			status: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!room) return;
		try {
			await updateRoom(formData);
			onClose();
		} catch (error) {
			console.error("Error al editar habitación:", error);
		}
	};

	if (!isOpen || !room) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl bg-white text-gray-900 border border-gray-200 shadow-2xl rounded-2xl px-8 py-6">
				<DialogHeader>
					<div className="flex items-center gap-4 mb-2">
						<div className="bg-indigo-600 rounded-xl w-14 h-14 flex items-center justify-center shadow-lg">
							<Pencil className="w-7 h-7 text-white" />
						</div>
						<div>
							<DialogTitle className="text-2xl font-extrabold tracking-tight text-gray-900">
								Editar Habitación
							</DialogTitle>
							<DialogDescription className="text-base text-gray-500">
								Modifica los datos de la habitación seleccionada
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Label
								htmlFor="number"
								className="text-gray-700 font-semibold"
							>
								Número *
							</Label>
							<Input
								id="number"
								name="number"
								value={formData.number}
								onChange={handleChange}
								placeholder="Ej: 101"
								required
								className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
							/>
						</div>
						<div>
							<Label
								htmlFor="type"
								className="text-gray-700 font-semibold"
							>
								Tipo *
							</Label>
							<Select
								value={formData.type}
								onValueChange={(value) => handleSelectChange("type", value)}
							>
								<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg">
									<SelectValue placeholder="Selecciona un tipo" />
								</SelectTrigger>
								<SelectContent>
									{roomTypes.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
									{/* Mostrar opción personalizada si el tipo no está en la lista */}
									{formData.type && !roomTypes.find(t => t.value === formData.type) && (
										<SelectItem key={formData.type} value={formData.type}>
											{formData.type} (Personalizado)
										</SelectItem>
									)}
								</SelectContent>
							</Select>
						</div>
						<div className="md:col-span-2">
							<Label
								htmlFor="price_per_night"
								className="text-gray-700 font-semibold"
							>
								Precio por noche *
							</Label>
							<Input
								id="price_per_night"
								type="number"
								name="price_per_night"
								value={formData.price_per_night}
								onChange={handleChange}
								placeholder="Ej: 120"
								min={0}
								required
								className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
							/>
						</div>
						<div className="md:col-span-2">
							<Label
								htmlFor="description"
								className="text-gray-700 font-semibold"
							>
								Descripción
							</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Ej: Habitación con vista al jardín"
								className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg"
							/>
						</div>
						<div className="md:col-span-2">
							<Label
								htmlFor="status"
								className="text-gray-700 font-semibold"
							>
								Estado *
							</Label>
							<Select
								value={formData.status}
								onValueChange={handleStatusChange}
							>
								<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg">
									<SelectValue placeholder="Selecciona estado" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="available">Disponible</SelectItem>
									<SelectItem value="occupied">Ocupado</SelectItem>
									<SelectItem value="maintenance">
										Mantenimiento
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-2">
						<span className="text-sm text-gray-400">
							Los campos con * son obligatorios
						</span>
						<div className="flex gap-3">
							<DialogClose asChild>
								<Button
									type="button"
									variant="ghost"
									className="border border-gray-200 text-gray-500 hover:bg-gray-100"
									onClick={onClose}
									disabled={loading}
								>
									Cancelar
								</Button>
							</DialogClose>
							<Button
								type="submit"
								variant="default"
								className="bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
								disabled={loading}
							>
								{loading ? (
									<span className="animate-spin mr-2">
										<Pencil className="w-4 h-4" />
									</span>
								) : (
									<>
										<Pencil className="w-4 h-4 mr-2" />
										Guardar Cambios
									</>
								)}
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}