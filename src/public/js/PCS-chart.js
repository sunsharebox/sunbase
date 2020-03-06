const label = {
	production: 'Production',
	consumption: 'Consumption',
	surplus: 'Surplus',
}

const backgroundColor = {
	production: 'rgba(255, 99, 132, 0.2)',
	consumption: 'rgba(54, 162, 235, 0.2)',
	surplus: 'rgba(255, 206, 86, 0.2)',
};

const borderColor = {
	production: 'rgba(255, 99, 132, 1)',
	consumption: 'rgba(54, 162, 235, 1)',
	surplus: 'rgba(255, 206, 86, 1)',
}

function createChart(ctx, labels, production, consumption, surplus) {
	new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: label.production,
				data: production,
				backgroundColor: backgroundColor.production,
				borderColor: borderColor.borderColor,
				borderWidth: 1,
			}, {
				label: label.consumption,
				data: consumption,
				backgroundColor: backgroundColor.consumption,
				borderColor: borderColor.consumption,
				borderWidth: 1,
			}, {
				label: label.surplus,
				data: surplus,
				backgroundColor: backgroundColor.surplus,
				borderColor: borderColor.surplus,
				borderWidth: 1,
			}],
		},
		options: {
			responsive: false,
			scales: {
				xAxes: [{
					ticks: {
						minRotation: 0,
						maxRotation: 65,
					},
				}],
			},
		}
	});
}