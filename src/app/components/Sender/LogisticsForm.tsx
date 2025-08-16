"use client";

import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Truck, Loader2, MapPin, Phone, User, PlusCircle, Trash2 } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_DELIVERY } from "../graphql/mutations";

export default function LogisticsForm() {
  const [pickup, setPickup] = useState({ name: "", contact: "", address: "", lat: null, lng: null });
  const [dropoffs, setDropoffs] = useState([{ name: "", contact: "", address: "", lat: null, lng: null }]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState("Regular");
  const [step, setStep] = useState(1);

  const [createDelivery, { loading: sendLoading }] = useMutation(CREATE_DELIVERY);

  // --- Validation functions ---
  const validatePickup = () =>
    pickup.name.trim() !== "" &&
    pickup.contact.trim() !== "" &&
    pickup.address.trim() !== "" &&
    pickup.lat !== null &&
    pickup.lng !== null;

  const validateDropoffs = () =>
    dropoffs.every(
      (d) =>
        d.name.trim() !== "" &&
        d.contact.trim() !== "" &&
        d.address.trim() !== "" &&
        d.lat !== null &&
        d.lng !== null
    );

  const validateVehicle = () => selectedVehicle !== null;

  const isFormValid = validatePickup() && validateDropoffs() && validateVehicle();

  // --- Handle form submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await createDelivery({
        variables: {
          input: {
            pickup,
            dropoffs,
            vehicle: selectedVehicle,
            serviceType,
          },
        },
      });
      alert("Delivery scheduled successfully!");
    } catch (err) {
      console.error(err);
      alert("Error scheduling delivery");
    }
  };

  // --- Render pickup form ---
  const renderPickupForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Pickup Information
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Sender Name" value={pickup.name} onChange={(e) => setPickup({ ...pickup, name: e.target.value })} />
        <Input placeholder="Sender Contact" value={pickup.contact} onChange={(e) => setPickup({ ...pickup, contact: e.target.value })} />
        <Textarea placeholder="Pickup Address" value={pickup.address} onChange={(e) => setPickup({ ...pickup, address: e.target.value })} />
      </CardContent>
    </Card>
  );

  // --- Render dropoff form(s) ---
  const renderDropoffsForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Dropoff Information
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {dropoffs.map((dropoff, idx) => (
          <div key={idx} className="border p-4 rounded-xl space-y-3 relative">
            <Input placeholder="Recipient Name" value={dropoff.name} onChange={(e) => {
              const copy = [...dropoffs];
              copy[idx].name = e.target.value;
              setDropoffs(copy);
            }} />
            <Input placeholder="Recipient Contact" value={dropoff.contact} onChange={(e) => {
              const copy = [...dropoffs];
              copy[idx].contact = e.target.value;
              setDropoffs(copy);
            }} />
            <Textarea placeholder="Dropoff Address" value={dropoff.address} onChange={(e) => {
              const copy = [...dropoffs];
              copy[idx].address = e.target.value;
              setDropoffs(copy);
            }} />
            {dropoffs.length > 1 && (
              <Button type="button" variant="destructive" size="sm"
                onClick={() => setDropoffs(dropoffs.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" className="w-full" onClick={() => setDropoffs([...dropoffs, { name: "", contact: "", address: "", lat: null, lng: null }])}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Another Dropoff
        </Button>
      </CardContent>
    </Card>
  );

  // --- Render vehicle selection ---
  const renderVehicleStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Truck className="w-5 h-5" /> Select Vehicle
        </h2>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {["Bike", "Car", "Van"].map((vehicle) => (
          <Button
            key={vehicle}
            type="button"
            variant={selectedVehicle === vehicle ? "default" : "outline"}
            onClick={() => setSelectedVehicle(vehicle)}
            className="w-full"
          >
            {vehicle}
          </Button>
        ))}
      </CardContent>
    </Card>
  );

  // --- Render service type ---
  const renderServiceStep = () => (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Service Type</h2>
      </CardHeader>
      <CardContent className="flex gap-4">
        {["Regular", "Express"].map((type) => (
          <Button
            key={type}
            type="button"
            variant={serviceType === type ? "default" : "outline"}
            onClick={() => setServiceType(type)}
            className="w-full"
          >
            {type}
          </Button>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {step === 1 && renderPickupForm()}
      {step === 2 && renderDropoffsForm()}
      {step === 3 && renderVehicleStep()}
      {step === 4 && renderServiceStep()}

      <div className="flex justify-between">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < 4 && (
          <Button type="button" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        )}
        {step === 4 && (
          <Button
            type="submit"
            disabled={!isFormValid || sendLoading}
            className="customgrad text-white w-full flex justify-center items-center"
          >
            {sendLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Truck className="w-5 h-5 mr-2" />}
            Schedule Delivery
          </Button>
        )}
      </div>
    </form>
  );
      }
