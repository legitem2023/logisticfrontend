<Select name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
  <option value="">Select a vehicle type</option>
  {data.getVehicleTypes.map((vehicle: any, idx: number) => (
    <option key={idx} value={vehicle.name}>
      {vehicle.name}
    </option>
  ))}
</Select>
