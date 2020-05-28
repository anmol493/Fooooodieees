const $eatable=document.querySelector('.eatable');
const $menWear=document.querySelector('.men-wear');
const $womenWear=document.querySelector('.women-wear');
const $electronic=document.querySelector('.electronic');
const $essential=document.querySelector('.essential');
if($eatable){
$eatable.addEventListener('click',()=>{
    console.log('hi');
    window.location = "eatable"
});
}
$menWear.addEventListener('click',(event)=>{
    console.log('hi');
});
$womenWear.addEventListener('click',(event)=>{
    console.log('hi');
});
$electronic.addEventListener('click',(event)=>{
    console.log('hi');
});
$essential.addEventListener('click',(event)=>{
    console.log('hi');
});