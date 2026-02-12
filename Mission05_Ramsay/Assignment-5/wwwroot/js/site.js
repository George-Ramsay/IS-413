$(document).ready(function () {
    const hoursInput = $("#hoursInput");
    const rateInput = $("#rateInput");
    const totalOutput = $("#totalOutput");
    const validationMessage = $("#hoursValidation");
    const calculateButton = $("#calculateButton");

    if (hoursInput.length === 0) {
        return;
    }

    calculateButton.on("click", function () {
        const hours = parseFloat(hoursInput.val());
        const rate = parseFloat(rateInput.val());

        if (Number.isNaN(hours) || hours <= 0) {
            validationMessage.text("Please enter a positive number of hours.");
            totalOutput.val("");
            return;
        }

        validationMessage.text("");
        const total = hours * rate;
        totalOutput.val(`$${total.toFixed(2)}`);
    });
});
