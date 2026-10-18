// Selected projects use month-precision ISO dates; a null end means ongoing.
// Fixed dates keep ordering deterministic without parsing the display labels.
export function compareProjectRecency(first, second) {
  const firstPeriod = first.timeline ?? {};
  const secondPeriod = second.timeline ?? {};
  const ongoingOrder = Number(secondPeriod.end === null) - Number(firstPeriod.end === null);

  return ongoingOrder || (secondPeriod.end ?? secondPeriod.start ?? "")
    .localeCompare(firstPeriod.end ?? firstPeriod.start ?? "");
}
